import "../css/styles.css";
import "../css/normalize.css";
import NavDays from "./seances/navDays.jsx";
import {useDispatch, useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect} from "react";
import {getWeekdayNumber} from "../js/utils.js";
import {fetchHalls, fetchMovies, getSeancesByDate} from "../redux/slices/cinema.js";

export default function ClientPage() {

    const dispatch = useDispatch();

    const {seances, chosenDate,films} = useSelector(state => state.cinema);
    //const day = getWeekdayNumber(chosenDate);

    useEffect(()=>{
        console.log("useeffect called");
        dispatch(fetchMovies());
        dispatch(fetchHalls())
    },[])

    useEffect(() => {
       // console.log("useEffect chosenDate",chosenDate)

        dispatch(getSeancesByDate(chosenDate));
    },[chosenDate]);

    const renderMovie = (movieId) => {
        //console.log("renderMovie seances",seances);
        //console.log("renderMovie seances[movieId]",seances[movieId]);
        const seancesForMovie = seances[movieId].seances
        if (seancesForMovie && seancesForMovie.length > 0) {
            return <Movie key={`movie-/${movieId}`} film={films[movieId]} seances={seancesForMovie}/>;
        }
        else {
            console.log("not movies")
        }
    };
//console.log("films",films);
    //console.log("seances",seances);
    return (<>

        <NavDays/>
        <main>
            {seances ? Object.keys(seances).map(movieId => renderMovie(movieId)) : null}
        </main>
    </>);
}
/*

* */