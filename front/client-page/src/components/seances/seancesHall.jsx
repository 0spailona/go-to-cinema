import {useSelector} from "react-redux";
import TimeBlock from "./timeBlock.jsx";
import {getWeekdayNumber} from "../../js/utils.js";

export  default function SeancesHall({hallId,filmId}) {


    console.log("ClientPage filmId",filmId);
    console.log("SeancesHall hallId",hallId);
    const {halls,films,chosenDate} = useSelector(state => state.cinema);
    const day = getWeekdayNumber(chosenDate)
    const hall = halls[hallId];
    const film = films[filmId];



    return (
        <div className="movie-seances__hall">
            <h3 className="movie-seances__hall-title">{hall.name}</h3>
            <ul className="movie-seances__list">
                {film.seances[day][hallId].map((seance,index) => <TimeBlock key={index} time={seance}
                                                                            hallId={hallId} filmId={filmId}/>)}
            </ul>
        </div>
    )
}