import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getHallById, getMovieById, getSeanceById, toBook} from "../../js/api.js";
import {setChosenSeance, setError, setInitialChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {getDateStringFromDate, getStartTimeStringFromMinutes} from "../../js/utils.js";
import Popup from "../common/popup.jsx";
import Loader from "react-js-loader";
import TicketInfo from "./ticketInfo.jsx";
import MyButton from "../common/MyButton.jsx";
import Hint from "./hint.jsx";

let hall, time, movie, places, cost, seance, prices;

export default function TicketContent({seanceId, selectedPlaces}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        chosenSeance,
        chosenDate,
        loading,
        error
    } = useSelector(state => state.cinema);

    const [errorView, setErrorView] = useState({isError: false, message: ""});


    const getHall = async (id) => {
        // console.log("getHall");
        const response = await getHallById(id);
        if (response.status === "success") {
            //console.log("getHal response", response);
            return response.data;
        }
        else {
            dispatch(setError(response.message));
            //return null;
        }
    };

    const getMovie = async (id) => {
        //console.log("getMovie");
        const response = await getMovieById(id);
        if (response.status === "success") {
            //console.log("getMovie response",response);
            movie = response.data;
        }
        else {
            dispatch(setError(response.message));
        }
    };

    const getSeance = async (id) => {

        //console.log("ClientPage getSeance",id);
        const response = await getSeanceById(id);
        if (response.status === "success") {
            console.log("getSeance response.data",response.data)
            time = getStartTimeStringFromMinutes(response.data.seance.startTime);
            console.log("getSeance time",time);
            return {hallId: response.data.seance.hallId, movieId: response.data.seance.movieId, seance: response.data};
        }
        else {
            dispatch(setInitialChosenSeance());
            dispatch(setError(response.message));
            return {hallId: null, movieId: null, seance: null};
        }
    };

    console.log(11);
    useEffect(() => {
        console.log("useEffect TicketContent []");
        dispatch(setLoading(true));

        async function getData() {
            const data = await getSeance(seanceId);

            if (!data.hallId || !data.movieId || !data.seance) {
                //console.log("error data", data);
                hall = null;
                movie = null;
                time = null;
                dispatch(setError("Что-то пошло не так"));
            }

            const hallData = await getHall(data.hallId);

            /* if (!hallData) {
                 dispatch(setError("Что-то пошло не так"));
             }*/

            await getMovie(data.movieId);
            dispatch(setChosenSeance({...data.seance, hallData}));
        }

        getData();

        dispatch(setLoading(false));
    }, []);

    console.log(12);
    useEffect(() => {
        if (!error) {
            setErrorView({isError: false, message: ""});
        }
        if (error) {
            setErrorView({isError: true, message: error});
        }
    }, [error]);

    console.log(13);


    const getPlacesForView = () => {
        let view = "";
        for (let i = 0; i < selectedPlaces.length; i++) {
            const separator = i === selectedPlaces.length - 1 ? "" : ", ";
            view = `${view}ряд ${selectedPlaces[i].rowIndex + 1} место ${selectedPlaces[i].placeIndex + 1}${separator}`;
        }
        return view;
    };

    console.log(14);
    seance = chosenSeance.seanceData;
    selectedPlaces = chosenSeance.selectedPlaces;
    //hall = halls[seance.hallId];
    hall = chosenSeance.hallData;
    //time = getStartTimeStringFromMinutes(seance.startTime);
    //movie = movies[seance.movieId];
    places = getPlacesForView();
    prices = hall.prices;
    cost = selectedPlaces.reduce((acc, place) => acc + prices[place.lastStatus], 0);

    console.log(15);

    const toBookPlaces = async () => {
        const data = {seanceId: seance.id, places: selectedPlaces};
        const response = await toBook(data);
        if (response.status === "success") {
            await dispatch(setInitialChosenSeance());
            window.location = `/showBooking/${response.data}`;
        }
        else {
            dispatch(setError(response.message));
        }
    };

    console.log("ticket movie",movie)
    console.log("ticket hall",hall)
    console.log("ticket time",time)

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
                            <TicketInfo info="Места" data={places}/>
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