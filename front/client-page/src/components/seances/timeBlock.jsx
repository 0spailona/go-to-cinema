import {useDispatch} from "react-redux";
//import { fetchSeanceById} from "../../redux/slices/cinema.js";
import {NavLink} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import {setChosenSeance, setLoading, setSeances} from "../../redux/slices/cinema.js";
import {getSeanceById, getSeancesByDate} from "../../js/api.js";

export default function TimeBlock({seance}) {

    const dispatch = useDispatch();
    //console.log("TimeBlock seance",seance);
   // const date = new Date(seance.startTime)
    //const start = date.getHours() * 60 + date.getMinutes();
    const startTime = getStartTimeStringFromMinutes(seance.startTime)

   /* const chooseSeance = async (id) =>{
        dispatch(setLoading(true));
        const response = await getSeanceById(id);
        if (response.status === "success") {
            dispatch(setChosenSeance(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoading(false));
        //dispatch(fetchSeanceById(id))
    }*/

    return (
        <li className="movie-seances__time-block">
        <NavLink className="movie-seances__time" to={`/hall/${seance.id}`}
                 //onClick={() => chooseSeance(seance.id)}
        >{startTime.hours}:{startTime.min}
            </NavLink>
    </li>
    );
}