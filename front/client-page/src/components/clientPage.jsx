import "../css/styles.css";
import "../css/normalize.css";
import NavDays from "./seances/navDays.jsx";
import {useDispatch, useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect, useState} from "react";
import {getSeancesObj} from "../js/utils.js";
/*import {fetchHalls,
    //fetchMovies,
getSeancesByDate, setLoading} from "../redux/slices/cinema.js";*/
import {isOpenSails, getMovies, getHalls, getSeancesByDate} from "../js/api.js";
import {setHalls, setLoading, setMovies, setSeances} from "../redux/slices/cinema.js";
//import {setHalls, setLoadingHalls} from "../../../admin-page/src/redux/slices/halls.js";
//import {getHalls} from "../../../admin-page/src/js/api.js";
//import {getMovies} from "../js/api.js;

export default function ClientPage() {

    const dispatch = useDispatch();

    const {seances, chosenDate, loading, films, halls} = useSelector(state => state.cinema);

    //const [seanceObj, setSeanceObj] = useState({});
    const [drawMovies, setDrawMovies] = useState(false);

    const isDrawFilms = async () => {
        dispatch(setLoading(true));
        const response = await isOpenSails();
        if (response.status === "success" && response.data) {
            setDrawMovies(true);
            return true
        }
        else {

            //TODO ERROR
        }
        dispatch(setLoading(false));
        return false;
    };

    const getMoviesFromServer = async () => {
        dispatch(setLoading(true));
        const response = await getMovies();
        if (response.status === "success") {
            dispatch(setMovies(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoading(false));
    };

    const getHallsFromServer = async () => {
        dispatch(setLoading(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoading(false));
    };

    const getSeances = async (date) => {
        dispatch(setLoading(true));
        const response = await getSeancesByDate(date);
        if (response.status === "success") {
            dispatch(setSeances(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoading(false));
    };

    useEffect(() => {
        //console.log("useeffect called");
        async function toStart() {
            //await fetchToken()
           if(await isDrawFilms()){
               //dispatch(fetchMovies());
               ///dispatch(fetchHalls());
               await getHallsFromServer();
               await getMoviesFromServer();
               await getSeances(chosenDate);
           }

        }

        toStart();

    }, []);

   /* useEffect(() => {
        console.log("useEffect chosenDate", chosenDate);
        async function getNewSeances() {
            await getSeances();
        }

        //dispatch(getSeancesByDate(chosenDate));
    }, [chosenDate]);*/

    /*useEffect(() => {
        //console.log("useeffect called");
        setSeanceObj(getSeancesObj(seances));
    }, [seances]);*/

    const renderMovie = (movieId) => {
        //console.log("renderMovie seanceObj",seanceObj);
        //console.log("renderMovie movieId",movieId);
        // console.log("renderMovie seanceObj[movieId]",seanceObj[movieId]);
        const movieSeancesByHallId = seances[movieId];
        if (movieSeancesByHallId && Object.keys(movieSeancesByHallId).length > 0) {
            return <Movie key={`movie-/${movieId}`} movieId={movieId} movieSeancesByHallId={movieSeancesByHallId}/>;
        }
    };


//console.log("films",films);
    console.log("drawMovies",drawMovies);
    return (<>

        <NavDays onChange={getSeances}/>
        <main>
            {drawMovies ?
                <>
                    {seances && Object.keys(seances).length > 0 ? Object.keys(seances).map(movieId => renderMovie(movieId)) :
                <p>На выбранный день нет сеансов</p>}
                </> :
                <p>Продажа билетов временно приостановлена</p>}
        </main>
    </>);
}
/*

* */