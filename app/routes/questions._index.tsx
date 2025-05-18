import { useNavigate } from "@remix-run/react";
import Modal from "~/components/utils/Modal";
import "~/styles/startQuiz.css";

export const meta = () => {
  return [
    {
      title: "بدء الاختبار – هل أنت مستعد؟",
      description:
        "صفحة تأكيد البدء في الاختبار. اضغط 'ابدأ الآن' إذا كنت جاهزاً للانتقال للأسئلة وقياس معلوماتك.",
    }
  ];
};

export default function StartQuiz() {
  const navigate = useNavigate();

  function startQuiz() {
    navigate("/questions/1");
  }

  return (
    <Modal onClose={startQuiz}>
      <div className="start-quiz-container">
        <h1 className="quiz-heading">هل أنت مستعد لبدء الاختبار؟</h1>
        <button className="start-button" onClick={startQuiz}>
          ابدأ الآن
        </button>
      </div>
    </Modal>
  );
}