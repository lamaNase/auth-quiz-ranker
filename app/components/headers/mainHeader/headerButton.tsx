
function HeaderButton(props) {
    return (
        <button className="headerButton">
            < img src={props.srcIcon} alt={props.text} />
            <p>{props.text}</p>
        </button>
    );
}

export default HeaderButton;