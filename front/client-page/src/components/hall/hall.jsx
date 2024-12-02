import {useSelector} from "react-redux";
import {useState} from "react";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";

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
   // console.log("Hall chosenSeance", chosenSeance);


    const toggleBig = (e) => {
        //console.log(e.target);
        if (e.target.classList.contains("toBig")) {
            setToDoBig(true);
        }
        else {
            setToDoBig(false);
        }

        //console.log("to do Big");
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
                            <PriceLegend status={placesType.standart}/>
                            <PriceLegend status={placesType.vip}/>
                        </div>
                        <div className="col">
                            <PriceLegend status={placesType.taken}/>
                            <PriceLegend status={placesType.selected}/>
                        </div>
                    </div>
                </div>
                <button className="acceptin-button" onClick="location.href='payment.html'">Забронировать</button>
            </section> : ""}

        </main>
    );
}