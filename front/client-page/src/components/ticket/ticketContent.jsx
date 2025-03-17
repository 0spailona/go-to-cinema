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


export default function TicketContent({seanceId, selectedPlaces}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        chosenSeance,
        chosenDate,
    } = useSelector(state => state.cinema);

    const [errorView, setErrorView] = useState({isError: false, message: ""});
    const [loading, setLoading] = useState(false);
    const [hall, setHall] = useState(null);
    const [movie, setMovie] = useState(null);
    const [places, setPlaces] = useState(selectedPlaces);
    const [cost, setCost] = useState(null);
    const [time, setTime] = useState(null);

    const getHall = async (id) => {
        const response = await getHallById(id);
        if (response.status === "success") {
            return {hall: response.data, message: null};
        }
        else {
            return {hall: null, message: response.message};
        }
    };

    const getMovie = async (id) => {
        const response = await getMovieById(id);
        if (response.status === "success") {
            return {movie: response.data, message: null};
        }
        else {
            return {movie: null, message: response.message};
        }
    };

    const getSeance = async (id) => {

        const response = await getSeanceById(id);
        if (response.status === "success") {

            return {
                hallId: response.data.seance.hallId,
                movieId: response.data.seance.movieId,
                seanceData: response.data
            };
        }
        else {
            dispatch(setInitialChosenSeance());
            return {hallId: null, movieId: null, seanceData: null, message: response.message};
        }
    };

    useEffect(() => {
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

        setLoading(false);
    }, []);


    if (!hall || !movie || !time || !places || !cost) {
        return <Popup isVisible={errorView.isError} message={errorView.message}
                      onClose={() => {
                          setErrorView({isError: false, message: ""});
                          navigate("/");
                      }}/>;
    }


    const toBookPlaces = async () => {

        const data = {seanceId, places};

        const response = await toBook(data);
        if (response.status === "success") {
            await dispatch(setInitialChosenSeance());
            window.location = `/showBooking/${response.data}`;
        }
        else {
            setErrorView({isError: true, message: response.message});
        }
    };

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