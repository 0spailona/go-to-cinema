import {NavLink} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";

export default function TimeBlock({seance}) {

    const startTime = getStartTimeStringFromMinutes(seance.startTime);

    return (
        <li className="movie-seances__time-block">
            <NavLink className="movie-seances__time" to={`/hall/${seance.id}`}
            >{startTime.hours}:{startTime.min}
            </NavLink>
        </li>
    );
}