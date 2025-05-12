import "~/styles/winnerCard.css";

export default function WinnerCard(props) {
    return (
        <div
            id={props.id}
            className="winner-card"
            style={{ background: props.bgColor }}
        >
            <div className="winner-rank">{props.rank}</div>
            <div className="winner-name">
                <div>{props.firstName}</div>
                <div>{props.lastName}</div>
            </div>
            <hr className="winner-divider" />
            <div className="winner-points">{props.points} نقطة</div>
        </div>
    );
}