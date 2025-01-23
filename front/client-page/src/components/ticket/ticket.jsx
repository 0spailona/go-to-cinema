import MyButton from "../common/MyButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import TicketInfo from "./ticketInfo.jsx";
import Hint from "./hint.jsx";
import {setLoading} from "../../redux/slices/cinema.js";
import {useEffect, useState} from "react";
import {validate} from "react-email-validator";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import {getQR} from "../../js/api.js";

export default function Ticket() {

    const dispatch = useDispatch();

    const {chosenSeance, halls, movies, prices, qr, chosenDate, drawPage,seances} = useSelector(state => state.cinema);


    let hall, time, movie, places, cost, seance, selectedPlaces;
    const getPlacesForView = () => {
        let view = "";
        for (let i = 0; i < selectedPlaces.length; i++) {
            const separator = i === selectedPlaces.length - 1 ? "" : ", ";
            view = `${view}ряд: ${selectedPlaces[i].rowIndex} место: ${selectedPlaces[i].placeIndex}${separator}`;
        }
        return view;
    };


    if (!chosenSeance) {
        console.log("no seances selected");
    }
    else {
        seance = chosenSeance.seanceData;
        selectedPlaces = chosenSeance.selectedPlaces;
        hall = halls[seance.hallId];
        time = getStartTimeStringFromMinutes(seance.startTime);
        movie = movies[seance.movieId];
        places = getPlacesForView();
        cost = selectedPlaces.reduce((acc, place) => acc + prices[place.lastStatus], 0);

    }

    const [emailInputValue, setEmailInputValue] = useState("");

    const toBook = async () => {
        dispatch(setLoading(true));
//console.log("toBook seance",seance)
        const data = {seanceId: seance.id, places: selectedPlaces};
        const response = await getQR(data);
        if (response.status === "success") {

        }
        else {
            //TODO ERROR
        }

        dispatch(setLoading(false));
    };

    const onGetQR = () => {
        if (validate(emailInputValue)) {
            //dispatch(getQR(emailInputValue));
        }
        else {
            console.log("email is not valid");
        }
    };


    return (
        <>{drawPage ?
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
                        {qr ? <img className="ticket__info-qr" src="" alt="Здесь должен быть ваш qr"/> : <>
                            <div className="ticket__info-email">
                                <label className="ticket__info-label" htmlFor="email">Введите ваш e-mail</label>
                                <input type="email" className="ticket__info-input"
                                       placeholder="n-d-p@mail.ru" value={emailInputValue}
                                       name="email"
                                       id="email"
                                       onChange={e => setEmailInputValue(e.target.value)}
                                       required/>

                            </div>
                            <MyButton text="Получить код бронирования" onClick={onGetQR}/>
                            <MyButton text="Получить код бронирования без копии на email" onClick={toBook}/>
                        </>
                        }
                        <Hint text="После бронирования билет будет доступен в этом окне, а также придёт вам
                        на почту. Покажите QR-код кассиру."/>
                        <Hint text="Приятного просмотра!"/>
                    </div>
                </section>
            </main>
            :
            <p>Продажа билетов временно приостановлена</p>}
        </>
    )
        ;
}