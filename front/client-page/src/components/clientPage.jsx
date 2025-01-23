import "../css/styles.css";
import "../css/normalize.css";
import NavDays from "./seances/navDays.jsx";
import {useDispatch, useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect, useState} from "react";
import {isOpenSails, getMovies, getHalls, getSeancesByDate} from "../js/api.js";
import {setDrawPage, setHalls, setLoading, setMovies, setSeances} from "../redux/slices/cinema.js";

let timerId = null;

export default function ClientPage() {

    const dispatch = useDispatch();

    const {seances, chosenDate, drawPage,loading} = useSelector(state => state.cinema);

    //const [seanceObj, setSeanceObj] = useState({});
    //const [drawMovies, setDrawMovies] = useState(false);

    const isDrawFilms = async () => {
        dispatch(setLoading(true));
        const response = await isOpenSails();
        //console.log("response",response);
        if (response.status === "success") {
            dispatch(setDrawPage(response.data))

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

    const onTimer = async () => {
        if(await isDrawFilms()){
            //dispatch(fetchMovies());
            ///dispatch(fetchHalls());
            await getHallsFromServer();
            await getMoviesFromServer();
            await getSeances(chosenDate);
        }

    }

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
            //const interval = setInterval(onTimer,5000)

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
    //console.log("drawMovies",drawPage);
    return (<>

        <NavDays onChange={getSeances}/>
        <main>
            {drawPage ?
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