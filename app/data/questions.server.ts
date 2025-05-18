
export async function getQuestionsStatuses(userId) {
    const res = await fetch(`${process.env.BASE_URL}/questions.json?shallow=true`);
    if (!res.ok) {
        throw {message: `Error fetching shallow keys: ${res.status}`};
    }

    const keysObj = await res.json();

    const numOfQuestions = Object.keys(keysObj || {}).length;

    const userStatusesRes = await fetch(`${process.env.BASE_URL}/userQuestions/${userId}.json`);
    const userStatuses = await userStatusesRes.json();

    const statuses = [];


    for (let qid = 1; qid <= numOfQuestions; qid++) {
        const questionData = userStatuses?.[qid] ?? { status: -1, selectedAnswer: null };
        statuses.push({
            status: questionData.status ?? -1,
            selectedAnswer: questionData.selectedAnswer ?? null,
        });
        console.log("adding: ", qid);

    }

    return statuses;
}

export async function getQuestionStatus(userId, questionId) {
    const res = await fetch(`${process.env.BASE_URL}/userQuestions/${userId}/${questionId}.json`);

    if (!res.ok) {
        throw new Error(`Error fetching question status: ${res.status}`);
    }

    const questionData = await res.json();

    return {
        status: questionData?.status ?? -1,
        selectedAnswer: questionData?.selectedAnswer ?? null,
    };
}

export async function getQuestionById(id) {
    const res = await fetch(`${process.env.BASE_URL}/questions/${id}.json`);
    if (!res.ok) {
        if (res.status === 404) return null;

    }
    return await res.json();
}

export async function updateQuestionStatus(userId, questionId, payload) {
    const updateRes = await fetch(
        `${process.env.BASE_URL}/userQuestions/${userId}/${questionId}.json`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );

    if (!updateRes.ok) {
        throw { message: "Failed to save question status." };
    }
}

export async function incrementUserScore(userId: string) {
    const scoreRes = await fetch(`${process.env.BASE_URL}/userScores/${userId}.json`);

    if (!scoreRes.ok) {
        throw new Error(`Error fetching user score: ${scoreRes.status}`);
    }

    const currentScore = await scoreRes.json();
    const newScore = (currentScore ?? 0) + 1;

    const updateRes = await fetch(`${process.env.BASE_URL}/userScores/${userId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScore),
    });

    if (!updateRes.ok) {
        throw new Error(`Error updating user score: ${updateRes.status}`);
    }

    return newScore;
}