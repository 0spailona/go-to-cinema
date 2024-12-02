import {useSelector} from "react-redux";
import {useState} from "react";
import HallScheme from "./hallScheme.jsx";

export default function Hall() {

    const {chosenSeance, halls, films} = useSelector(state => state.cinema);

    let hall, time, film;
    if (!chosenSeance) {
        console.log("no seances selected");
    }
    else {
        hall = halls[chosenSeance.hallId];
        time = chosenSeance.time;
        film = films[chosenSeance.filmId];
    }

    const [isToDoBig, setToDoBig] = useState(false);
    console.log("Hall chosenSeance", chosenSeance);


    const toggleBig = (e) => {
        console.log(e.target);
        if (e.target.classList.contains("toBig")) {
            setToDoBig(true);
        }
        else {
            setToDoBig(false);
        }

        console.log("to do Big");
    };

    return (
        <main onClick={toggleBig}>
            {chosenSeance ? <section className="buying">
                <div className="buying__info">
                    <div className="buying__info-description">
                        <h2 className="buying__info-title">{film.title}</h2>
                        <p className="buying__info-start">Начало сеанса: {time.hours}:{time.min}</p>
                        <p className="buying__info-hall">{hall.name}</p>
                    </div>
                    <div className="buying__info-hint toBig" onDoubleClick={toggleBig}>
                        <p className="toBig">Тапните дважды,<br/>чтобы увеличить</p>
                    </div>
                </div>
                <div className={`buying-scheme toBig ${isToDoBig ? "buying-scheme__chair_selected" : ""}`}>
                    <HallScheme hallId={chosenSeance.hallId}/>

                    <div className="buying-scheme__legend">
                        <div className="col">
                            <p className="buying-scheme__legend-price"><span
                                className="buying-scheme__chair buying-scheme__chair_standart"></span> Свободно (<span
                                className="buying-scheme__legend-value">250</span>руб)</p>
                            <p className="buying-scheme__legend-price"><span
                                className="buying-scheme__chair buying-scheme__chair_vip"></span> Свободно VIP (<span
                                className="buying-scheme__legend-value">350</span>руб)</p>
                        </div>
                        <div className="col">
                            <p className="buying-scheme__legend-price"><span
                                className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято</p>
                            <p className="buying-scheme__legend-price"><span
                                className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано</p>
                        </div>
                    </div>
                </div>
                <button className="acceptin-button" onClick="location.href='payment.html'">Забронировать</button>
            </section> : ""}

        </main>
    );
}