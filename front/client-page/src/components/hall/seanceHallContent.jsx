import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getHallById, getMovieById, getSeanceById} from "../../js/api.js";
import {setChosenSeance, setError, setInitialChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import Popup from "../common/popup.jsx";
import Loader from "react-js-loader";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";
import MyButton from "../common/MyButton.jsx";

export default function SeanceHallContent({seanceId}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        chosenSeance,
        loading, error
    } = useSelector(state => state.cinema);

    const [isToDoBig, setToDoBig] = useState(false);
    const [errorView, setErrorView] = useState({isError: false, message: ""});
    const [hall, setHall] = useState(null);
    const [movie,setMovie] = useState(null);
    const [time, setTime] = useState(null);

    const getSeance = async (id) => {
        const response = await getSeanceById(id);
        if (response.status === "success") {
            //time = getStartTimeStringFromMinutes(response.data.seance.startTime);
            // console.log("getSeance time",time);
            return {hallId: response.data.seance.hallId, movieId: response.data.seance.movieId, seanceData: response.data};
        }
        else {
            dispatch(setInitialChosenSeance());
            dispatch(setError(response.message));
            return {hallId: null, movieId: null, seance: null};
        }
    };
    const getHall = async (id) => {
        // console.log("getHall");
        const response = await getHallById(id);
        if (response.status === "success") {
            //console.log("getHal response", response);
            return {hall:response.data, message:null};
        }
        else {
            return {hall:null, message:response.message};
        }
    };

    const getMovie = async (id) => {
        //console.log("getMovie");
        const response = await getMovieById(id);
        if (response.status === "success") {
            //console.log("getMovie response",response);
            // movie = response.data;
            return {movie:response.data, message:null};
        }
        else {
            //dispatch(setError(response.message));
            return {movie:null, message:response.message};
        }
    };

    useEffect(() => {
        //console.log("useEffect []");
        dispatch(setLoading(true));

        async function getData() {
            const data = await getSeance(seanceId);

            if (!data.hallId || !data.movieId || !data.seance) {
                //console.log("error data", data);
                // hall = null;
                // movie = null;
                //  time = null;
                dispatch(setError("Что-то пошло не так"));
            }

            const hallData = await getHall(data.hallId);

            if (!hallData.hall) {
                dispatch(setError(hallData.message));
            }

            const movieData = getMovie(data.movieId);
            if (!movieData.movie) {
                dispatch(setError(movieData.message));
            }

            setMovie(movieData.movie);
            setHall(hallData.hall);
            //onsole.log("data.",data)
            setTime(getStartTimeStringFromMinutes(data.seanceData.seance.startTime));
            //await getMovie(data.movieId);
            dispatch(setChosenSeance({...data.seanceData, hallData:hallData.hall}));
        }

        getData();

        dispatch(setLoading(false));
    }, []);


    useEffect(() => {
        if (!error) {
            setErrorView({isError: false, message: ""});
        }
        if (error) {
            setErrorView({isError: true, message: error});
        }
    }, [error]);

    //hall = chosenSeance.hallData;

    const toggleBig = (e) => {
        if (e.target.classList.contains("toBig")) {
            setToDoBig(true);
        }
        else {
            setToDoBig(false);
        }
    };

    const onBooking = () => {

        if (chosenSeance.selectedPlaces.length > 0) {
            //console.log("seanceHall selectedPlaces", chosenSeance.selectedPlaces);
            const places = chosenSeance.selectedPlaces.map(place => `${place.rowIndex}_${place.placeIndex}`)
            //console.log("places", places);
            navigate(`/ticket?seanceId=${seanceId}&places=${places}`);
        }
        else {
            setErrorView({isError: true, message: "Выберите, пожалуйста, места"});
        }
    };

    //console.log("hall",hall)
    //console.log("hall",hall)
   // console.log("time",time)
    //console.log("chosenSeance", chosenSeance)
    return (
        <>
            <Popup isVisible={errorView.isError} message={errorView.message}
                   onClose={() => setErrorView({isError: false, message: ""})}/> :


            { loading ?
                <div className="loader">
                    <Loader type="bubble-scale" bgColor="rgba(241, 235, 230, 0.95)" color="#FFFFFF"
                            size={50}/>
                </div> :
                <main onClick={toggleBig}>
                    {chosenSeance.seanceData ? <section className="buying">
                        <div className="buying__info">
                            <div className="buying__info-description">
                                <h2 className="buying__info-title">{movie?.title}</h2>
                                <p className="buying__info-start">Начало сеанса: {time?.hours}:{time?.min}</p>
                                <p className="buying__info-hall">{hall?.name}</p>
                            </div>
                            <div className="buying__info-hint toBig" onDoubleClick={toggleBig}>
                                <p className="toBig">Тапните дважды,<br/>чтобы увеличить</p>
                            </div>
                        </div>
                        <div className={`buying-scheme toBig ${isToDoBig ? "buying-scheme__chair_selected" : ""}`}>
                            <HallScheme hall={hall}/>

                            <div className="buying-scheme__legend">
                                <div className="col">
                                    <PriceLegend status={placesType.standard} prices={hall?.prices}/>
                                    <PriceLegend status={placesType.vip} prices={hall?.prices}/>
                                </div>
                                <div className="col">
                                    <PriceLegend status={placesType.taken}/>
                                    <PriceLegend status={placesType.selected}/>
                                </div>
                            </div>
                        </div>
                        <MyButton text="Забронировать" onClick={onBooking}/>
                    </section> : ""}
                </main>}


        </>
    );
}
