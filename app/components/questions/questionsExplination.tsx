export default function QuestionExplanation({ title, correctAnswer, explanation, onClose }) {
  return (
    <div className="question-explanation">
      <h2 className="question-title">{title}</h2>

      <div className="correct-answer-box">
        <strong>✔ الإجابة الصحيحة:</strong> <span>{correctAnswer}</span>
      </div>

      <div className="answer-explanation-text">
        <h3>شرح الإجابة:</h3>
        <p>{explanation}</p>
      </div>
      <button className="close-button" onClick={onClose}>اغلاق</button>
    </div>
  );
}