import { HiDotsVertical } from "react-icons/hi";
import HeaderButtons from "./headerButtons";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MainHeader(props: any) {
    const [showMenue, setShowMenue] = useState(false);
    function menueClick(e) {
        setShowMenue(!showMenue);
    }

    return (
        <header className="main-header">
            <img src="images/tafawqLogo.svg"></img>
            <div id="header-btns">
                < HeaderButtons />
            </div>
            <div className="left-side">
                <img className="search" src="images/searchIcon.svg" alt="search icon"></img>
                {props.userId !== null && <p className="user-points">
                    <span>{props.userPoints}</span>
                    <img src="images/light_bulb.svg" alt="light bulb"></img>
                </p>}
                <div className="rectangle"></div>
                <div className="menue">
                    < HiDotsVertical
                        className="kebab-icon"
                        onClick={menueClick}
                    />
                    {showMenue && <ul>
                        {props.userId === null && <Link to="/auth">
                            تسجيل الدخول
                        </Link>}
                        {props.userId !== null && <form method="post" action="/logout">
                            <button>تسجيل الخروج</button>
                        </form>}
                    </ul>}
                </div>
            </div>
        </header>
    );
}