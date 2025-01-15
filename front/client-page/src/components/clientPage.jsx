import "../css/styles.css";
import "../css/normalize.css";
import NavDays from "./seances/navDays.jsx";
import {useDispatch, useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect, useState} from "react";
import {getSeancesObj, getWeekdayNumber} from "../js/utils.js";
import {fetchHalls, fetchMovies, getSeancesByDate} from "../redux/slices/cinema.js";

export default function ClientPage() {

    const dispatch = useDispatch();

    const {seances, chosenDate,films,halls} = useSelector(state => state.cinema);

    const [seanceObj,setSeanceObj] = useState({});
    //const day = getWeekdayNumber(chosenDate);

    useEffect(()=>{
        //console.log("useeffect called");
        dispatch(fetchMovies());
        dispatch(fetchHalls())
    },[])

    useEffect(() => {
       // console.log("useEffect chosenDate",chosenDate)

        dispatch(getSeancesByDate(chosenDate));
    },[chosenDate]);

    useEffect(() => {
        //console.log("useeffect called");
        setSeanceObj(getSeancesObj(seances))
    },[seances])

    const renderMovie = (movieId) => {
        //console.log("renderMovie seanceObj",seanceObj);
        //console.log("renderMovie movieId",movieId);
       // console.log("renderMovie seanceObj[movieId]",seanceObj[movieId]);
        const movieSeancesByHallId = seanceObj[movieId]
        if (movieSeancesByHallId && Object.keys(movieSeancesByHallId).length > 0) {
            return <Movie key={`movie-/${movieId}`} filmId={movieId} movieSeancesByHallId={movieSeancesByHallId}/>;
        }
    };


//console.log("films",films);
    //console.log("seanceObj",seanceObj);
    return (<>

        <NavDays/>
        <main>
            {seanceObj && Object.keys(seanceObj).length > 0 ? Object.keys(seanceObj).map(movieId => renderMovie(movieId)) :
                <p>На выбранный день нет сеансов</p>}
        </main>
    </>);
}
/*

* */