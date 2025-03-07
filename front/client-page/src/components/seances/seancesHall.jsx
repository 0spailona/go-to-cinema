import {useSelector} from "react-redux";
import TimeBlock from "./timeBlock.jsx";

export default function SeancesHall({seances, hallId, onChooseSeance}) {

    const {halls} = useSelector(state => state.cinema);

    const hall = halls[hallId];

    return (
        <div className="movie-seances__hall">
            <h3 className="movie-seances__hall-title">{hall.name}</h3>
            <ul className="movie-seances__list">
                {Object.keys(seances).map((seanceId) => <TimeBlock key={seanceId} seance={seances[seanceId]}
                                                                   onClick={(seanceId) => {
                                                                      // console.log("SeancesHal seanceId",seanceId)
                                                                       onChooseSeance(seanceId);
                                                                   }}/>)}
            </ul>
        </div>
    );
}