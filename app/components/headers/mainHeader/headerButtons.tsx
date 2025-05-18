import HeaderButton from "~/components/headers/mainHeader/headerButton";

function HeaderButtons(props) {
    return (
        <div className="headerButtons">
            < HeaderButton srcIcon="images/myPlane.svg" text="خطتي" />
            < HeaderButton srcIcon="images/myLibrary.svg" text="مكتبتي" />
            < HeaderButton srcIcon="images/revision.svg" text="مراجعة" />
            < HeaderButton srcIcon="images/forms.svg" text="نماذج" />
            < HeaderButton srcIcon="images/levels.svg" text="مستويات" />
        </div>
    );
}

export default HeaderButtons;