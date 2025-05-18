import { Form, Link, redirect, useActionData, useNavigation, useParams, useSearchParams } from "@remix-run/react";
import { FaArrowRight } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'; // Make sure this is present!
import LogoSide from "~/components/headers/logoSide";
import { login, signup, validateUserData, validateUserPhoneNumber } from "~/data/users.server";
import "~/styles/auth.css";

export function meta({ location }) {
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "login";

  return [
    {
      title: mode === "signup" ? "إنشاء حساب باستخدام رقم الهاتف" : "تسجيل الدخول باستخدام رقم الهاتف",
    },
    {
      name: "description",
      content:
        mode === "signup"
          ? "أنشئ حسابك عبر رقم الجوال واختر شخصيتك المفضلة في خطوات بسيطة."
          : "قم بتسجيل الدخول بسرعة باستخدام رقم الجوال فقط، بدون كلمة مرور.",
    },
  ];
}

export default function PhoneNumberRegisteration() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  const errors = useActionData();
  console.log("errors", errors);
  const status = useNavigation();
  const isSubmitting = status.state !== "idle";

  return (
    <main className="auth-page">
      <div className="register">
        <span id="back">
          <Link to={"/auth?mode=" + mode}><FaArrowRight color="#1999D6" size={18} /></Link>
          رجوع
        </span>
        <Form id="phone-num-form" method="post">
          <h1>
            {mode === "login" ? "ادخل رقم جوالك لتسجيل الدخول" : "علمنا معلومات حسابك.."}
          </h1>
          {mode === "signup" ?
            <div id="username">
              <div className="firstName">
                <label htmlFor="firstName">اسمك الأول</label>
                <input type="text" id="firstName" name="firstName" />
                {errors ? <p className="error-message">{errors.firstName ? errors.firstName : ""}</p> : ""}
              </div>
              <div className="lastName">
                <label htmlFor="lastName">اسم العائلة</label>
                <input type="text" name="lastName" id="lastName" />
                {errors ? <p className="error-message">{errors.lastName ? errors.lastName : ""}</p> : ""}
              </div>
            </div>
            : ""
          }
          <div className="phone-number">
            <label htmlFor="phoneNumber">رقم الجوال المحمول</label>
            <PhoneInput
              country={'ps'}
              enableSearch={true}
              inputStyle={{ width: "100%" }}
              inputProps={{
                name: "phoneNumber"
              }}
            />
            {errors ? <p className="error-message">{errors.phoneNumber ? errors.phoneNumber : ""}</p> : ""}
          </div>
          {mode === "signup" ?
            <div className="fav_character">
              <label htmlFor="gender-selector">اختر شخصيتك المفضلة</label>
              <div id="gender-selector">
                <label>
                  <input type="radio" name="gender" value="female" />
                  <img src="images/female.svg" alt="Female" />
                </label>
                <label>
                  <input type="radio" name="gender" value="male" />
                  <img src="images/male.svg" alt="Male" />
                </label>
              </div>
              {errors ? <p className="error-message">{errors.gender ? errors.gender : ""}</p> : ""}
            </div>
            : ""}
          <button disabled={isSubmitting}>متابعة</button>
        </Form>
      </div>
      <LogoSide parag={mode} />
    </main>
  );
}

export async function action(request) {
  const url = new URL(request.request.url);
  const mode = url.searchParams.get("mode");
  const formData = await request.request.formData();
  const userData = Object.fromEntries(formData);

  try {
    if (mode === "signup") {
      validateUserData(userData);
      return await signup(userData);
    } else {
      validateUserPhoneNumber(userData.phoneNumber);
      console.log("validation is done");
      return await login(userData.phoneNumber);
    }
  } catch (error) {
    return error;
  }
}