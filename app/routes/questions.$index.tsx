import { Form, useLoaderData, useParams, useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimesCircle } from "react-icons/fa";
import { json, redirect } from "@remix-run/node";
import { getQuestionById, getQuestionStatus, incrementUserScore, updateQuestionStatus } from "~/data/questions.server";
import { requireSession } from "~/data/users.server";
import { MdFormatAlignRight } from "react-icons/md";
import Modal from "~/components/utils/Modal";
import QuestionExplination from "~/components/questions/questionsExplination";

export function meta({ data }) {
    if (!data) {
        return [
            { title: "السؤال" },
            { name: "description", content: "أجب على السؤال المعروض وتحقق من مدى صحة إجابتك." }
        ];
    }

    return [
        { title: `السؤال: ${data.text}` },
        {
            name: "description",
            content: "اختر الإجابة الصحيحة لهذا السؤال وتعرف على شرح مفصل بعد اختيارك.",
        },
    ];
}

export default function Question() {
    const question = useLoaderData();
    const [selectedChoice, setSelectedChoice] = useState();
    const [showAnswerExplination, setShowAnswerExplination] = useState(false);
    const formRef = useRef(null);
    const { index } = useParams();

    useEffect(() => {
        if (question.status == -1) {
            console.log("selected set to null");
            setSelectedChoice(null);
        } else
            setSelectedChoice(question.selectedAnswer);
    }, [index, question]);

    function handleChange(e) {
        setSelectedChoice(e.target.value);
        console.log(e.target.value, "is selected");
        formRef.current?.submit();
    }

    function openAnswerExplination() {
        setShowAnswerExplination(true);
    }

    function closeAnswerExplination() {
        setShowAnswerExplination(false);
    }

    return (
        <Form ref={formRef} method="post" id="questionForm">
            <input type="hidden" name="correctAnswer" value={question.correctAnswer} />
            <input type="hidden" name="questionId" value={index} />
            <h1>{question.text}</h1>
            <div id="question-choices">
                {question.choices.map((choice, i) => {
                    const isSelected = selectedChoice == choice;
                    const className =
                        isSelected && question.status == 1
                            ? "correct"
                            : isSelected && question.status == 0
                                ? "wrong"
                                : "";

                    return (
                        <label key={i} className={className}>
                            <input
                                type="radio"
                                name="choice"
                                value={choice}
                                onChange={handleChange}
                                checked={isSelected}
                                disabled={question.status != -1}
                            />
                            {choice}
                            {isSelected && question.status == 1 && <FaCheck />}
                            {isSelected && question.status == 0 && <FaTimesCircle />}
                        </label>
                    );
                })}
                {question.status != -1 &&
                    <div className="question-feedback">
                        <p>
                            <FaCheck />
                            <span>
                                {question.status == 1 ? "اجابتك صحيحة" : "الاجابة الصحيحة: " + question.correctAnswer}
                            </span>
                        </p>
                        <button
                            className="answer-explination"
                            onClick={openAnswerExplination}
                            type="button">
                            < MdFormatAlignRight style={{ backgroundColor: '#1CB0F6', color: '#fff' }} />
                            <span>
                                شرح الاجابة
                            </span>
                        </button>
                    </div>
                }
            </div>
            {showAnswerExplination && <Modal onClose={closeAnswerExplination}>
                < QuestionExplination
                    title={question.text}
                    correctAnswer={question.correctAnswer}
                    explanation={question.explanation}
                    onClose={closeAnswerExplination}
                />
            </Modal>}
        </Form>
    );
}

export async function loader(request) {
    try {
        const userId = await requireSession(request.request);
        const questionId = Number.parseInt(request.params.index);
        const id = questionId - 1;

        const question = await getQuestionById(id);
        if (!question) {
            throw new Response(
                "Question #" + questionId + " Not Found", {
                status: 404,
                statusText: "Not Found"
            });
        }
        // Get status and selected answer
        const { status, selectedAnswer } = await getQuestionStatus(userId, questionId);

        return json({
            ...question,
            status,
            selectedAnswer,
        });
    } catch (error) {
        console.log("in question page", error);
        throw error;
    }
}

export async function action({ request, params }: any) {
    const userId = await requireSession(request);
    const formData = await request.formData();
    const selected = formData.get("choice");
    const correctAnswer = formData.get("correctAnswer");
    const questionId = formData.get("questionId");

    const status =
        selected === null
            ? -1
            : selected === correctAnswer
                ? 1
                : 0;

    const payload = {
        selectedAnswer: selected,
        status: status,
    };

    try {
        updateQuestionStatus(userId, questionId, payload);
        payload.status === 1 ? incrementUserScore(userId) : "";
        return redirect(`/questions/${questionId}`);
    } catch (error) {
        throw error;
    }
}