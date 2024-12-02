import "../css/styles.css"
import "../css/normalize.css"
import NavDays from "./seances/navDays.jsx";
import {useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect} from "react";
import {getWeekdayNumber} from "../js/utils.js";

export default function ClientPage() {

    const {films,chosenDate} = useSelector(state => state.cinema);
    //console.log("ClientPage films",films);
    const day = getWeekdayNumber(chosenDate)
    //console.log("ClientPage films", films)

    const renderMovie = (movie) =>{
        if(movie.seances[day]){
            console.log(movie.title)
            return <Movie key={`movie-/${movie.id}`} film={movie}/>
        }
        else {
            console.log("not movies")
        }
    }

    return (<>

        <NavDays/>
        <main>
            {Object.values(films).map(film => renderMovie(film))}
        </main>
    </>);
}
/*
* */