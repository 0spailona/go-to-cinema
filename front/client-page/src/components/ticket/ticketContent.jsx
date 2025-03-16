import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getHallById, getMovieById, getSeanceById, toBook} from "../../js/api.js";
import {setChosenSeance, setInitialChosenSeance} from "../../redux/slices/cinema.js";
import {getDateStringFromDate, getPlacesForView, getStartTimeStringFromMinutes} from "../../js/utils.js";
import Popup from "../common/popup.jsx";
import Loader from "react-js-loader";
import TicketInfo from "./ticketInfo.jsx";
import MyButton from "../common/MyButton.jsx";
import Hint from "./hint.jsx";
import {placesType} from "../../js/info.js";

//let hall, time, movie, places, cost, seance, prices;

export default function TicketContent({seanceId, selectedPlaces}) {

    //console.log("TicketContent selectedPlaces",selectedPlaces);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        chosenSeance,
        chosenDate,
        //loading,
        //error
    } = useSelector(state => state.cinema);

    const [errorView, setErrorView] = useState({isError: false, message: ""});
    const [loading, setLoading] = useState(false);
    const [hall, setHall] = useState(null);
    const [movie, setMovie] = useState(null);
    const [places, setPlaces] = useState(selectedPlaces);
    const [cost, setCost] = useState(null);
    //const [seance, setSeance] = useState(null);
    const [time, setTime] = useState(null);

    //const placesForView = getPlacesForView(selectedPlaces);
    //const [prices, setPrices] = useState(null);

    /*const checkPlacesOnServer = async () => {
        // console.log("getHall");
        const response = await checkPlaces(selectedPlaces,seanceId);
        if (response.status === "success") {
            //console.log("getHal response", response);
            //return response.data;
            return {places: response.data, message: null};
        }
        else {
            return {places: null, message: response.message};
            // setErrorView({isError: true, message: response.message});
            //dispatch(setError(response.message));
            //return null;
        }
    };*/

    const getHall = async (id) => {
        // console.log("getHall");
        const response = await getHallById(id);
        if (response.status === "success") {
            //console.log("getHal response", response);
            //return response.data;
            return {hall: response.data, message: null};
        }
        else {
            return {hall: null, message: response.message};
            // setErrorView({isError: true, message: response.message});
            //dispatch(setError(response.message));
            //return null;
        }
    };

    const getMovie = async (id) => {
        //console.log("getMovie");
        const response = await getMovieById(id);
        if (response.status === "success") {
            //console.log("getMovie response",response);
            //movie = response.data;
            return {movie: response.data, message: null};
        }
        else {
            return {movie: null, message: response.message};
            //dispatch(setError(response.message));
        }
    };

    const getSeance = async (id) => {

        //console.log("ClientPage getSeance",id);
        const response = await getSeanceById(id);
        if (response.status === "success") {
            //console.log("ticket getSeance response.data",response.data)
            /*time = getStartTimeStringFromMinutes(response.data.seance.startTime);
            console.log("getSeance time",time);
            return {hallId: response.data.seance.hallId, movieId: response.data.seance.movieId, seance: response.data};*/
            return {
                hallId: response.data.seance.hallId,
                movieId: response.data.seance.movieId,
                seanceData: response.data
            };
        }
        else {
            dispatch(setInitialChosenSeance());
            //setErrorView({isError: true, message: response.message});
            //dispatch(setError(response.message));
            return {hallId: null, movieId: null, seanceData: null, message: response.message};
            /* dispatch(setInitialChosenSeance());
             dispatch(setError(response.message));
             return {hallId: null, movieId: null, seance: null};*/
        }
    };

    console.log(11);
    useEffect(() => {
        console.log("useEffect TicketContent []");
        //dispatch(setLoading(true));
        setLoading(true);

        async function getData() {
            const data = await getSeance(seanceId);

            if (!data.hallId || !data.movieId || !data.seanceData) {
                setErrorView({isError: true, message: data.message});
            }

            const hallData = await getHall(data.hallId);

            if (!hallData.hall) {
                setErrorView({isError: true, message: hallData.message});
            }

            const movieData = await getMovie(data.movieId);
            if (!movieData.movie) {
                setErrorView({isError: true, message: movieData.message});
            }

            setMovie(movieData.movie);

            const places = selectedPlaces.map(place => {
                const lastStatus = hallData.hall.places[place["rowIndex"]][place["placeIndex"]];
                return {...place, lastStatus};
            });

            for (let place of selectedPlaces) {
                hallData.hall.places[place["rowIndex"]][place["placeIndex"]] = placesType.selected;
            }

            setPlaces(places)
            setHall(hallData.hall);
            setCost(places.reduce((acc, place) => acc + hallData.hall.prices[place.lastStatus], 0));
            setTime(getStartTimeStringFromMinutes(data.seanceData.seance.startTime));
            dispatch(setChosenSeance({...data.seanceData, hallData: hallData.hall}));
        }

        getData();

        //dispatch(setLoading(false));
        setLoading(false);
    }, []);

    console.log(12);

    if (!hall || !movie || !time || !places || !cost) {
        return <Popup isVisible={errorView.isError} message={errorView.message}
                      onClose={() => {
                          setErrorView({isError: false, message: ""});
                          navigate("/");
                      }}/>;
    }

    console.log(13);

    const toBookPlaces = async () => {
console.log("To Book Places chosenSeance.selectedPlaces",chosenSeance.selectedPlaces);
console.log("To Book Places places",places)
//TODO send places from state not from redux
        const data = {seanceId, places};
       // const data = {seanceId, places: chosenSeance.selectedPlaces};
        const response = await toBook(data);
        if (response.status === "success") {
            await dispatch(setInitialChosenSeance());
            window.location = `/showBooking/${response.data}`;
        }
        else {
            setErrorView({isError: true, message: response.message});
            //dispatch(setError(response.message));
        }
    };

    /* console.log("ticket movie",movie)
     console.log("ticket hall",hall)
     console.log("ticket time",time)*/

    return (
        <>
            <Popup isVisible={errorView.isError} message={errorView.message}
                   onClose={() => {
                       setErrorView({isError: false, message: ""});
                       navigate("/");
                   }}/>

            {loading ?
                <div className="loader">
                    <Loader type="bubble-scale" bgColor="rgba(241, 235, 230, 0.95)" color="#FFFFFF"
                            size={50}/>
                </div> :
                <main>
                    <section className="ticket">
                        <header className="tichet__check">
                            <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
                        </header>
                        <div className="ticket__info-wrapper">
                            <TicketInfo info="На фильм" data={movie.title}/>
                            <TicketInfo info="Места" data={getPlacesForView(selectedPlaces)}/>
                            <TicketInfo info="В зале" data={hall.name}/>
                            <TicketInfo info="На дату" data={getDateStringFromDate(new Date(chosenDate))}/>
                            <TicketInfo info="Начало сеанса" data={`${time.hours}:${time.min}`}/>
                            <TicketInfo info="Стоимость" data={`${cost}`} add=" рублей"/>
                            <MyButton text="Получить код бронирования" onClick={toBookPlaces}/>
                            <Hint text="После бронирования билет будет доступен в этом окне, а также придёт вам
                        на почту. Покажите QR-код кассиру."/>
                            <Hint text="Приятного просмотра!"/>
                        </div>
                    </section>
                </main>

            }
        </>
    );
}