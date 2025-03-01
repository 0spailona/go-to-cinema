import "../css/styles.css";
import "../css/normalize.css";
import NavDays from "./seances/navDays.jsx";
import {useDispatch, useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";
import {useEffect, useState} from "react";
import {getHalls, getMovies, getSeancesByDate, isOpenSails} from "../js/api.js";
import {
    setError,
    setHalls,
    setInitialChosenSeance,
    setIsDrawPage,
    setLoading,
    setMovies,
    setSeances
} from "../redux/slices/cinema.js";
import Loader from "react-js-loader";
import Popup from "./common/popup.jsx";
import {checkSeances, isEqual} from "../js/utils.js";


export default function ClientPage() {

    const dispatch = useDispatch();

    const {seances, chosenDate, isDrawPage, loading, lastIsDrawPage, error} = useSelector(state => state.cinema);
    const [errorView, setErrorView] = useState({isError: false, message: ""});

    const getMoviesFromServer = async () => {
        dispatch(setLoading(true));

        const response = await getMovies();
        if (response.status === "success") {
            dispatch(setMovies(response.data));
        }
        else {
            dispatch(setError("Проблемы с сервером. Попробуйте позже"));
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
            dispatch(setError("Проблемы с сервером. Попробуйте позже"));
        }
        dispatch(setLoading(false));
    };

    const getSeances = async (date) => {
        dispatch(setLoading(true));
        const response = await getSeancesByDate(date);
        if (response.status === "success") {

            const now = new Date();
            const seances = isEqual(new Date(date), now) ? checkSeances(response.data) : response.data;
            dispatch(setSeances(seances));
        }
        else {
            dispatch(setError("Проблемы с сервером. Попробуйте позже"));
        }
        dispatch(setLoading(false));
    };


    const updateData = async () => {
        await getHallsFromServer();
        await getMoviesFromServer();
        await getSeances(chosenDate);
    };

    useEffect(() => {

        if (isDrawPage && !lastIsDrawPage) {
            async function toGetNewData() {
                await updateData();
            }

            toGetNewData();
        }
    }, [isDrawPage]);

    useEffect(() => {
        dispatch(setInitialChosenSeance());

    }, []);

    useEffect(() => {
        if (!error) {
            setErrorView({isError: false, message: ""});
        }
        if (error) {
            setErrorView({isError: true, message: error});
        }
    }, [error]);


    const renderMovie = (movieId) => {
        const movieSeancesByHallId = seances[movieId];
        if (movieSeancesByHallId && Object.keys(movieSeancesByHallId).length > 0) {
            return <Movie key={`movie-/${movieId}`} movieId={movieId} movieSeancesByHallId={movieSeancesByHallId}/>;
        }
    };

    return (<>
        <Popup isVisible={errorView.isError} message={errorView.message}
               onClose={() => dispatch(setError(null))}/>
        <NavDays onChange={getSeances}/>
        <main>
            {isDrawPage ?
                loading ?
                    <div className="loader">
                        <Loader type="bubble-scale" bgColor="rgba(241, 235, 230, 0.95)" color="#FFFFFF"
                                size={50}/>
                    </div> :
                    <>
                        {seances && Object.keys(seances).length > 0 ? Object.keys(seances).map(movieId => renderMovie(movieId)) :
                            <p className="info">На выбранный день нет сеансов</p>}
                    </> :
                <p className="info">Продажа билетов временно приостановлена</p>}
        </main>
    </>);
}
