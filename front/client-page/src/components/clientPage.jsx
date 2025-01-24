import "../css/styles.css";
import "../css/normalize.css";
import NavDays from "./seances/navDays.jsx";
import {useDispatch, useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect, useState} from "react";
import {getHalls, getMovies, getSeancesByDate, isOpenSails} from "../js/api.js";
import {setChosenSeance, setIsDrawPage, setHalls, setLoading, setMovies, setSeances} from "../redux/slices/cinema.js";
import Loader from "react-js-loader";

let timerId = null;

export default function ClientPage() {

    const dispatch = useDispatch();

    const {seances, chosenDate, isDrawPage, loading,lastIsDrawPage} = useSelector(state => state.cinema);
    const [drawCount, setDrawCount] = useState(0);
    //const [lastDrawPage, setLastDrawPage] = useState(isDrawPage);

    //const [seanceObj, setSeanceObj] = useState({});
    //const [drawMovies, setDrawMovies] = useState(false);

    const isDrawFilms = async () => {
       // console.log("isDrawFilms isDrawPage", isDrawPage);

        const response = await isOpenSails();
        //console.log("response",response);
        if (response.status === "success") {
            dispatch(setIsDrawPage(response.data));
            return true;
        }
        else {

            //TODO ERROR
        }
        return false;
    };

    const getMoviesFromServer = async () => {
        dispatch(setLoading(true));
        //console.log("getMoviesFromServer");
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
       // console.log("getHallsFromServer");
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
        console.log("getSeances");
        const response = await getSeancesByDate(date);
        if (response.status === "success") {
            dispatch(setSeances(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoading(false));
    };


    const updateData = async () => {
        await getHallsFromServer();
        await getMoviesFromServer();
        await getSeances(chosenDate);
    }

    useEffect(()=>{
        console.log("useEffect isDrawPage",isDrawPage);
        console.log("useEffect last",lastIsDrawPage);
        if(isDrawPage && !lastIsDrawPage){
            async function toGetNewData(){
               await updateData()
            }
            toGetNewData();
        }
    },[isDrawPage])

    useEffect(() => {
        //console.log("useeffect called count",drawCount);
        dispatch(setChosenSeance(null));

        async function toStart() {
            //await fetchToken()
            /*if(await isDrawFilms()){
                //dispatch(fetchMovies());
                ///dispatch(fetchHalls());
                await getHallsFromServer();
                await getMoviesFromServer();
                await getSeances(chosenDate);
            }*/

            await isDrawFilms()
            const interval = setInterval(isDrawFilms, 5000);
        }

        toStart();

    }, []);


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
    //console.log("loading",loading);
    return (<>

        <NavDays onChange={getSeances}/>
        {loading ?
            <div className="loader">
                <Loader type="bubble-scale" bgColor="#63536C" color="#FFFFFF"
                        size={50}/>
            </div> :
            <main>
                {isDrawPage ?
                    <>
                        {seances && Object.keys(seances).length > 0 ? Object.keys(seances).map(movieId => renderMovie(movieId)) :
                            <p>На выбранный день нет сеансов</p>}
                    </> :
                    <p>Продажа билетов временно приостановлена</p>}
            </main>}
    </>);
}
/*

* */