import { NavLink } from "@remix-run/react";

export default function QuestionsNav(props: any) {
    return (
        <nav className="questions-nav">
            <ul>
                {props.statuses.map((questionStatus, index) => {
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
        </nav>
    );
}