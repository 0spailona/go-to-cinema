import MyButton from "../common/MyButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import TicketInfo from "./ticketInfo.jsx";
import Hint from "./hint.jsx";
import {
    //setBookingId,
    setChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {useEffect, useState} from "react";
import {validate} from "react-email-validator";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import {toBook, getSeanceById} from "../../js/api.js";
import Loader from "react-js-loader";
import Popup from "../common/popup.jsx";

export default function Ticket() {

    const dispatch = useDispatch();

    const {
        chosenSeance,
        halls,
        movies,
        prices,
        chosenDate,
        isDrawPage,
        loading,
        lastIsDrawPage,
        //bookingId,
    } = useSelector(state => state.cinema);

console.log("ticket");

    if (!chosenSeance.seanceData || chosenSeance.selectedPlaces.length === 0) {
        return <Popup isVisible={true} message="Что-то пошло не так"
                      onClose={() => {
                          //setError({isError: false, message: ""});
                          window.location = '/';
                      }}/>
        //setError({isError: true, message: "Что-то пошло не так"});
    }

    const [emailInputValue, setEmailInputValue] = useState("");
    const [error, setError] = useState({isError: false, message: ""});



    let hall, time, movie, places, cost, seance, selectedPlaces;

    useEffect(() => {
        if (isDrawPage && !lastIsDrawPage) {
            async function toGetUpdateSeance() {
                await getUpdateSeance(chosenSeance.seanceData.id);
            }

            toGetUpdateSeance();
        }
    }, [isDrawPage]);


    const getUpdateSeance = async (id) => {
        dispatch(setLoading(true));
        const response = await getSeanceById(id);
        if (response.status === "success") {
            dispatch(setChosenSeance(response.data));
        }
        else {
            dispatch(setChosenSeance(null));
        }
        dispatch(setLoading(false));
    };

    const getPlacesForView = () => {
        let view = "";
        for (let i = 0; i < selectedPlaces.length; i++) {
            const separator = i === selectedPlaces.length - 1 ? "" : ", ";
            view = `${view}ряд ${selectedPlaces[i].rowIndex + 1} место ${selectedPlaces[i].placeIndex + 1}${separator}`;
        }
        return view;
    };


    /*if (!chosenSeance.seanceData || chosenSeance.selectedPlaces.length === 0) {
        setError({isError: true, message: "Что-то пошло не так"});
    }
    else {*/
        seance = chosenSeance.seanceData;
        selectedPlaces = chosenSeance.selectedPlaces;
        hall = halls[seance.hallId];
        time = getStartTimeStringFromMinutes(seance.startTime);
        movie = movies[seance.movieId];
        places = getPlacesForView();
        cost = selectedPlaces.reduce((acc, place) => acc + prices[place.lastStatus], 0);

   // }



    const toBookPlaces = async () => {
       // dispatch(setLoading(true));
//console.log("toBook seance",seance)
        const data = {seanceId: seance.id, places: selectedPlaces};
        const response = await toBook(data);
        if (response.status === "success") {
            window.location = `/showBooking/${response.data}`
            //dispatch(setBookingId(response.data));
        }
    };


    return (
        <>
            <Popup isVisible={error.isError} message={error.message}
                   onClose={() => {
                       setError({isError: false, message: ""});
                       window.location = '/';
                   }}/>

            {isDrawPage ?
                loading ?
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
                                <TicketInfo info="На дату" data={chosenDate}/>
                                <TicketInfo info="Начало сеанса" data={`${time.hours}:${time.min}`}/>
                                <TicketInfo info="Стоимость" data={`${cost}`} add=" рублей"/>
                                    <MyButton text="Получить код бронирования" onClick={toBookPlaces}/>
                                <Hint text="После бронирования билет будет доступен в этом окне, а также придёт вам
                        на почту. Покажите QR-код кассиру."/>
                                <Hint text="Приятного просмотра!"/>
                            </div>
                        </section>
                    </main>
                :
                <p className="info">Продажа билетов временно приостановлена</p>}
        </>
    )
        ;
}