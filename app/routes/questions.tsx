import { Link, Outlet, redirect, useLoaderData, useParams } from "@remix-run/react";
import QuestionsHeader from "~/components/headers/questionsHeader";
import { getQuestionsStatuses } from "~/data/questions.server";
import { requireSession } from "~/data/users.server";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import Modal from "~/components/utils/Modal";
import "~/styles/questions.css";

export default function QuestionsPage() {
  const { index } = useParams();
  const current = index ? Number.parseInt(index, 10) : 1;
  const numOfQuestions = useLoaderData().length;

  const prev = current > 1 ? current - 1 : 1;
  const next = current + 1;

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  function handleFinishClick(e) {
    e.preventDefault(); // prevent navigation
    setShowModal(true);
  }

  function confirmFinish() {
    setShowModal(false);
    navigate("/"); // or wherever your home/finish page is
  }

  return (
    <main id="questions-page">
      <div id="question-side">
        <div>
          <p>سؤال {current} من {numOfQuestions}</p>
          <Outlet />
        </div>
        <footer>
          <Link
            to={`${prev}`}
            id="prev"
            className={current === 1 ? "disabled" : ""}
          >
            السابق
          </Link>

          {next === numOfQuestions + 1 ? (
            <button id="next" onClick={handleFinishClick}>
              انهاء
            </button>
          ) : (
            <Link
              to={`${next}`}
              id="next"
              className={current === numOfQuestions ? "disabled" : ""}
            >
              التالي
            </Link>
          )}
        </footer>
      </div>

      <QuestionsHeader />

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="confirm-dialog">
            <h2 className="confirm-title">هل أنت متأكد أنك تريد إنهاء الاختبار؟</h2>
            <div className="confirm-actions">
              <button className="btn-stay" onClick={() => setShowModal(false)}>
                البقاء في الاختبار
              </button>
              <button className="btn-finish" onClick={confirmFinish}>
                إنهاء
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export async function loader(request) {
  const userId = await requireSession(request.request);
  if(userId === null) {
    redirect("/auth");
  }
  const statuses = await getQuestionsStatuses(userId);
  return statuses;
}