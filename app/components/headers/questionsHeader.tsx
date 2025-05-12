import { NavLink, useLoaderData } from "@remix-run/react";

export default function QuestionsHeader() {
    const statuses = useLoaderData();
    console.log("statuses = ", statuses);

    return (
        <header id="questions-header">
            <div id="multiple-choice">
                <h1>اسئلة الإختيار من متعدد</h1>
                <p>
                    فيما يلي سؤال يتبعه اربع اختيارات
                    <span>المطلوب, هو اختيار الإجابة الصحيحة:</span>
                </p>
            </div>
            <nav>
                <ul>
                    {statuses.map((questionStatus, index) => {
                        let className = "";
                        if (questionStatus.status === 0) className = "wrong";
                        else if (questionStatus.status === 1) className = "correct";

                        return (
                            <li key={index}>
                                <NavLink to={`${index + 1}`} className={className}>
                                    {index + 1}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="markers">
                <div className="marker">
                    <span className="circle green"></span>
                    <span>صحيح</span>
                </div>
                <div className="marker">
                    <span className="circle red"></span>
                    <span>خاطئ</span>
                </div>
                <div className="marker">
                    <span className="circle gray"></span>
                    <span>الحالي</span>
                </div>
            </div>
        </header>
    );
}