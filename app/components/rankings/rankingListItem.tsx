import { Link } from "@remix-run/react";

export default function RankingListItem(props) {
    return (
        <li
            ref={props.ref}
            className={props.isCurrentUser ? "highlight" : "ranking-list-item"}
            key={props.id}>
            <div className="name-points">
                <div>
                    <span>{props.index + 1}</span>
                    <span>{props.firstName} {props.lastName}</span>
                </div>
                <span>{props.points} نقطة</span>
            </div>
            {props.isCurrentUser && <Link to="/questions">تدرب الآن</Link>}
        </li>
    );
}