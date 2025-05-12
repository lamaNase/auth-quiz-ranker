import "~/styles/logoSide.css";

export default function LogoSide(props) {
    return (
        <section id="logo-side">
            <img id="logo" src="images/tafawqLogo.svg" alt="logo"></img>
            <p id="learn-enjoy">
                تعلم واستمتع،
                <span>
                    وقفل عــلـى اخــــــتــبـارك!
                </span>
            </p>
            {props.parag === "signup"? <p id="signup-parag">
                مع تطبيق تفوّق، راح نخليك تذاكر بطرق ذكية، قصيرة وسريعة
                <span>
                    وممتعة بنفس الوقت، مع مميزات كثيرة ماتخلص!
                </span>
            </p> : ""
            }
            <div className="apps">
                <img src="images/appStore.svg" alt="app store"></img>
                <img src="images/googlePlay.svg" alt="google play"></img>
            </div>
            <div className="people-wrapper">
                <img id="man" src="images/man.svg" alt="man"></img>
                <img id="woman" src="images/woman.svg" alt="woman"></img>
            </div>
        </section>
    );
}