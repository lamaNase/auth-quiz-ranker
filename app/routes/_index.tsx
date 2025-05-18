import { Form, Link, useLoaderData } from "@remix-run/react";
import RankingList from "~/components/rankings/rankingList";
import WinnerCard from "~/components/winnerCard";
import { getAllUserScores, getUserFromSession, getUserGender } from "~/data/users.server";
import "~/styles/rankings.css";
import MainHeader from "~/components/headers/mainHeader/mainHeader";
import HeaderButtons from "~/components/headers/mainHeader/headerButtons";


export default function Index() {
    const loaderData = useLoaderData();
    const userId = loaderData.userId;
    const scores = loaderData.scores;
    const gender = loaderData.gender;

    const top3 = scores.slice(0, 3);
    const orderedTop3 = [top3[1], top3[0], top3[2]]; // [Rank2, Rank1, Rank3]


    return (
        <main id="rankings-page">
            < MainHeader
                userPoints={userId !== null ? scores.find(score => score.id === userId)?.score : 0}
                userId={userId}
            />
            <div id="rankings-content">
                <div className="cards">
                    {orderedTop3.map((winner, i) => (
                        <WinnerCard
                            key={winner.id}
                            id={`rank${i === 1 ? 1 : i === 0 ? 2 : 3}`}
                            rank={i === 1 ? 1 : i === 0 ? 2 : 3}
                            firstName={winner.firstName}
                            lastName={winner.lastName}
                            points={winner.score}
                            bgColor={
                                i === 1
                                    ? "#7C42B3" // center (Rank 1)
                                    : i === 0
                                        ? "#B41C75" // right (Rank 2)
                                        : "linear-gradient(to bottom, #FF9500, #FEC700)" // left (Rank 3)
                            }
                        />
                    ))}
                </div>
                < RankingList list={scores} currentUserId={userId} />
            </div>
            {gender && (
                <img className="gender"
                    src={
                        gender === "female"
                            ? "images/woman.svg"
                            : "images/man.svg"
                    }
                    alt={gender === "female" ? "woman icon" : "man icon"}
                />
            )}
            <footer>
                < HeaderButtons />
            </footer>
        </main>
    );
}

export async function loader(request) {
    const scores = await getAllUserScores();
    const userId = await getUserFromSession(request.request);
    const gender = await getUserGender(userId);

    scores.sort((a, b) => b.score - a.score);

    return {
        userId: userId ?? null,
        gender: gender ?? null,
        scores,
    };
}