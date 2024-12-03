import MyButton from "../common/MyButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import TicketInfo from "./ticketInfo.jsx";
import Hint from "./hint.jsx";
import {getQR} from "../../redux/slices/cinema.js";

export default function Ticket() {

    const dispatch = useDispatch();

    const {chosenSeance, halls, films, chosenPlaces, prices,qr} = useSelector(state => state.cinema);
    let hall, time, film, places, cost;
    const getPlacesForView = () => {
        let view = "";
        for (let i = 0; i < chosenPlaces.length; i++) {
            const separator = i === chosenPlaces.length - 1 ? "" : ", ";
            view = `${view}ряд: ${chosenPlaces[i].rowIndex} место: ${chosenPlaces[i].placeIndex}${separator}`;
        }
        return view;
    };

    const getCost = () => {
        const hallState = halls[chosenSeance.hall.id];
        const placesStatus = []
        for(let place of chosenPlaces) {
            placesStatus.push(hallState.places[place.rowIndex][place.placeIndex]);
        }
        return placesStatus.reduce((acc, status) => acc + prices[status], 0)
    };

    if (!chosenSeance) {
        console.log("no seances selected");
    }
    else {
        hall = chosenSeance.hall;
        time = chosenSeance.time;
        film = films[chosenSeance.filmId];
        places = getPlacesForView();
        cost = getCost();
    }

    const onGetQR =()=>{
        dispatch(getQR())
    }

    return (
        <main>
            <section className="ticket">
                <header className="tichet__check">
                    <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
                </header>
                <div className="ticket__info-wrapper">
                    <TicketInfo info="На фильм" data={film.title}/>
                    <TicketInfo info="Места" data={places}/>
                    <TicketInfo info="В зале" data={hall.name}/>
                    <TicketInfo info="Начало сеанса" data={`${time.hours}:${time.min}`}/>
                    <TicketInfo info="Стоимость" data={`${cost}`} add=" рублей"/>
                    {qr ? <img className="ticket__info-qr" src="" alt="Здесь должен быть ваш qr"/> :
                        <MyButton text="Получить код бронирования" onClick={onGetQR}/>}
                    <Hint text="После бронирования билет будет доступен в этом окне, а также придёт вам
                        на почту. Покажите QR-код кассиру."/>
                    <Hint text="Приятного просмотра!"/>
                </div>
            </section>
        </main>
    );
}