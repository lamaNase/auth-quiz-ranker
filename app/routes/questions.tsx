import { Link, Outlet, redirect, useLoaderData, useParams } from "@remix-run/react";
import QuestionsHeader from "~/components/headers/questionsHeader";
import { getQuestionsStatuses } from "~/data/questions.server";
import { requireSession } from "~/data/users.server";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import Modal from "~/components/utils/Modal";
import "~/styles/questions.css";
import { MdList } from "react-icons/md";
import QuestionsNav from "~/components/headers/questionsNav";

export function meta() {
  return [
    { title: "الأسئلة | اختبارك قيد التنفيذ" },
    {
      name: "description",
      content: "أجب عن الأسئلة واحدة تلو الأخرى، تتبع تقدمك، وأنهِ الاختبار عندما تكون مستعدًا. تأكد من الإجابة على جميع الأسئلة قبل الإنهاء.",
    },
  ];
}

export default function QuestionsPage() {
  const { index } = useParams();
  const current = index ? Number.parseInt(index, 10) : 1;
  const numOfQuestions = useLoaderData().length;
  const statuses = useLoaderData();

  const prev = current > 1 ? current - 1 : 1;
  const next = current + 1;

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showQuestionsList, setShowQuestionsList] = useState(false);

  function handleFinishClick(e) {
    e.preventDefault(); // prevent navigation
    setShowModal(true);
  }

  function confirmFinish() {
    setShowModal(false);
    navigate("/"); // or wherever your home/finish page is
  }

  function openQuestionsList() {
    setShowQuestionsList(true);
  }

  function closeQuestionsList() {
    setShowQuestionsList(false);
  }

  return (
    <main id="questions-page">
      <div id="question-side">
        <div>
          <p>
            سؤال {current} من {numOfQuestions}
            < MdList
              className="show-questions-list"
              onClick={openQuestionsList}
            />
          </p>
          {showQuestionsList && <Modal onClose={closeQuestionsList}>
            < QuestionsNav statuses={statuses} />
          </Modal>}
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

      <QuestionsHeader statuses={statuses} />

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="confirm-dialog">
            <h2 className="confirm-title">
              هل أنت متأكد أنك تريد إنهاء الاختبار؟
            </h2>
            {statuses.filter(status => status.status == -1).length > 0 && (
              <p className="unanswered-warning">
                لديك {statuses.filter(status => status.status == -1).length} سؤال غير مُجاب عليه.
              </p>
            )}

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
  if (userId === null) {
    redirect("/auth");
  }
  const statuses = await getQuestionsStatuses(userId);
  console.log("statuses", statuses);

  return statuses;
}