import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRETS],
    sameSite: "lax",
    maxAge: 30 * 25 * 60 * 60,
    httpOnly: true
  }
});

async function createUserSession(userId, redirctPAth) {
  // behind the seend, remix generates such a cookie for us
  const session = await sessionStorage.getSession();
  // store the user id inside this cookie
  session.set('userId', userId);
  // we must send then this cookie to the user, we must make a response 
  return redirect(redirctPAth, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  });
}

// We can access the cookie just in the backend
export async function getUserFromSession(request: any) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId)
    return null;
  return userId;
}

export async function distroyUserSession(request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}

export async function requireSession(request) {
  const userId = await getUserFromSession(request);
  if (userId === null) {
    throw redirect("/auth");
  }
  return userId;
}

export async function signup(newUser: any) {
  const queryUrl = `${process.env.BASE_URL}/users.json?orderBy=${encodeURIComponent('"phoneNumber"')}&equalTo=${encodeURIComponent(`"${newUser.phoneNumber}"`)}`;
  const checkRes = await fetch(queryUrl);
  if (!checkRes.ok) {
    throw new Error("Failed to check for existing user");
  }

  const existing = await checkRes.json();
  if (existing && Object.keys(existing).length > 0) {
    throw { phoneNumber: "هذا الرقم مستخدم، حاول برقم آخر" };
  }

  const createRes = await fetch(`${process.env.BASE_URL}/users.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  if (!createRes.ok) {
    throw { phoneNumber: `Failed to create user: ${createRes.status}` };
  }
  console.log(createRes);

  const createdData = await createRes.json();
  const userId = createdData.name;
  console.log("user id is ", userId);
  return createUserSession(userId, "/questions");
}

export async function login(phoneNumber: any) {
  console.log("login function entered");
  const queryUrl = `${process.env.BASE_URL}/users.json?orderBy=${encodeURIComponent('"phoneNumber"')}&equalTo=${encodeURIComponent(`"${phoneNumber}"`)}`;
  const checkRes = await fetch(queryUrl);
  if (!checkRes.ok) {
    throw { phoneNumber: "Failed to check for existing user" };
  }

  const existing = await checkRes.json();

  if (existing && Object.keys(existing).length > 0) {
    console.log("user found");
    const userId = Object.keys(existing)[0];
    console.log("user id: ", userId);
    return createUserSession(userId, "/questions");
  }
  throw { phoneNumber: "لا يوجد مستخدم مسجل بهذا الرقم" };
}

export function validateUserPhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return "رقم هاتفك غير صالح، حاول ادخال رقم آخر";
  }

  const phoneObj = parsePhoneNumberFromString(phoneNumber);

  if (!phoneObj || !phoneObj.isValid()) {
    return "هذا الرقم غير صالح، تأكد من إدخاله بشكل صحيح";
  }

  return "";
}

export function validateUserData(newUser) {
  console.log("user", newUser);
  let isValid = true;
  const validationErrors = {};
  if (!newUser.firstName || newUser.firstName.trim().length === 0) {
    isValid = false;
    validationErrors.firstName = "ادخل اسمك رجاءاً";
  } if (!newUser.lastName || newUser.lastName.trim().length === 0) {
    isValid = false;
    validationErrors.lastName = "ادخل اسم عائلتك رجاءاً";
  } if (!newUser.gender) {
    isValid = false;
    validationErrors.gender = "اختر شخصيتك المفضلة رجاءاً";
  } if (!newUser.phoneNumber || validateUserPhoneNumber(newUser.phoneNumber)) {
    isValid = false;
    validationErrors.phoneNumber = validateUserPhoneNumber(newUser.phoneNumber);
  }
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export async function getAllUserScores() {
  // Fetch scores
  const scoresRes = await fetch(`${process.env.BASE_URL}/userScores.json`);
  if (!scoresRes.ok) {
    throw new Error(`Error fetching user scores: ${scoresRes.status}`);
  }
  const scoresObj = await scoresRes.json();
  if (!scoresObj) {
    return [];
  }

  // Fetch users
  const usersRes = await fetch(`${process.env.BASE_URL}/users.json`);
  if (!usersRes.ok) {
    throw new Error(`Error fetching users: ${usersRes.status}`);
  }
  const usersObj = await usersRes.json();

  // Merge data
  const scoresArray = Object.entries(scoresObj).map(([userId, score]) => {
    const user = usersObj?.[userId] ?? {};
    return {
      id: userId,
      score: score,
      firstName: user.firstName ?? "Unknown",
      lastName: user.lastName ?? "",
    };
  });

  return scoresArray;
}

export async function getUserGender(userId) {
  const usersRes = await fetch(`${process.env.BASE_URL}/users.json`);
  if (!usersRes.ok) {
    throw new Error(`Error fetching users: ${usersRes.status}`);
  }
  const usersObj = await usersRes.json();

  // Find user by ID
  const user = usersObj?.[userId];

  // Check if user exists
  if (!user) {
    return null;
  }

  // Return the gender of the user
  return user.gender ?? "Unknown"; // Default to "Unknown" if gender is missing
}