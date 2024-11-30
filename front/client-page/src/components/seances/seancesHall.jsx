import {useSelector} from "react-redux";
import TimeBlock from "./timeBlock.jsx";

export  default function SeancesHall({hallId,filmId}) {


    const {halls,films} = useSelector(state => state.films);
    const hall = halls[hallId];
    const film = films[filmId];

    console.log("SeancesHall filmId",filmId);

    return (
        <div className="movie-seances__hall">
            <h3 className="movie-seances__hall-title">{hall.name}</h3>
            <ul className="movie-seances__list">
                {film.seances[hallId].map(seance => <TimeBlock key={seance.id} time={seance} />)}
                <li className="movie-seances__time-block"><a className="movie-seances__time"
                                                             href="hall.html">10:20</a></li>
                <li className="movie-seances__time-block"><a className="movie-seances__time"
                                                             href="hall.html">14:10</a></li>
                <li className="movie-seances__time-block"><a className="movie-seances__time"
                                                             href="hall.html">18:40</a></li>
                <li className="movie-seances__time-block"><a className="movie-seances__time"
                                                             href="hall.html">22:00</a></li>
            </ul>
        </div>
    )
}