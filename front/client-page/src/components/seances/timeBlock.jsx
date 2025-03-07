import {NavLink} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";

export default function TimeBlock({seance, onClick}) {

    const startTime = getStartTimeStringFromMinutes(seance.startTime);

   //console.log("TimeBlock seance.id",seance.id)

    return (
        <li className="movie-seances__time-block">
            <div className="movie-seances__time" onClick={() => onClick(seance.id)}
            >{startTime.hours}:{startTime.min}
            </div>
        </li>
    );
}

/*
 <li className="movie-seances__time-block">
            <NavLink className="movie-seances__time" to={`/hall/${seance.id}`}
            >{startTime.hours}:{startTime.min}
            </NavLink>
        </li>
*/