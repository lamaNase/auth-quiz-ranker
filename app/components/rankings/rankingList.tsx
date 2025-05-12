import { useEffect, useRef } from "react";
import RankingListItem from "./rankingListItem";

export default function RankingList({ list, currentUserId }) {
    const userItemRef = useRef(null);

    useEffect(() => {
        if (userItemRef.current) {
            userItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            userItemRef.current.classList.add('highlight');

            // Optional: remove highlight after a few seconds
            const timeout = setTimeout(() => {
                userItemRef.current?.classList.remove('highlight');
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [currentUserId]);

    return (
        <ul id="ranking-list">
            {list.map((item, index) => {
                const isCurrentUser = item.id === currentUserId;

                return (
                    <RankingListItem
                        ref={isCurrentUser ? userItemRef : null}
                        id={item.id}
                        index={index}
                        firstName={item.firstName}
                        lastName={item.lastName}
                        points={item.score}
                        key={item.id}
                        isCurrentUser={isCurrentUser} // optional to style differently
                    />
                );
            })}
        </ul>
    );
}