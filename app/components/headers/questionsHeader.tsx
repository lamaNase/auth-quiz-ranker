import { NavLink, useLoaderData } from "@remix-run/react";
import QuestionsNav from "./questionsNav";

export default function QuestionsHeader({statuses}) {
    

    return (
        <header id="questions-header">
            <div id="multiple-choice">
                <h1>اسئلة الإختيار من متعدد</h1>
                <p>
                    فيما يلي سؤال يتبعه اربع اختيارات
                    <span>المطلوب, هو اختيار الإجابة الصحيحة:</span>
                </p>
            </div>
            < QuestionsNav statuses={statuses} />
        </header>
    );
}