import {useSelector} from "react-redux";
import TimeBlock from "./timeBlock.jsx";
import {getWeekdayNumber} from "../../js/utils.js";

export  default function SeancesHall({seances,hallId}) {


    //console.log("ClientPage filmId",filmId);
    //console.log("SeancesHall hallId",hallId);
    const {halls} = useSelector(state => state.cinema);
    //const day = getWeekdayNumber(chosenDate)
    const hall = halls[hallId];

    //console.log("ClientPage film",film);
    //console.log("SeancesHall hall",hall);

    return (
        <div className="movie-seances__hall">
            <h3 className="movie-seances__hall-title">{hall.name}</h3>
            <ul className="movie-seances__list">
                {Object.keys(seances).map((seanceId) => <TimeBlock key={seanceId} seance={seances[seanceId]}/>)}
            </ul>
        </div>
    )
}