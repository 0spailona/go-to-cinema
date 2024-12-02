import {useDispatch} from "react-redux";
import {changeChosenSeance, chosenSeance} from "../../redux/slices/cinema.js";
import {NavLink} from "react-router-dom";

export default function TimeBlock({time,hallId,filmId}) {

    const dispatch = useDispatch();
   // console.log("TimeBlock time",time);

    return (
        <li className="movie-seances__time-block">
        <NavLink className="movie-seances__time" to="/seance"
                 onClick={() => dispatch(changeChosenSeance({hallId,filmId,time}))}>{time.hours}:{time.min}
            </NavLink>
    </li>
    );
}