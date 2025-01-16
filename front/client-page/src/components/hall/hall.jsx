import {useSelector} from "react-redux";
import {useState} from "react";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";
import MyButton from "../common/MyButton.jsx";
import {Link} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";

export default function Hall() {

    const {chosenSeance, halls, films} = useSelector(state => state.cinema);

    let hall, time, film;
    if (!chosenSeance.seanceData) {
        console.log("no seances selected");
    }
    else {
        //console.log("hall chosenSeance",chosenSeance)
        hall = halls[chosenSeance.seanceData.hallId];
        //console.log("Hall hall",hall);

         time = getStartTimeStringFromMinutes(chosenSeance.startTime)
        //time = chosenSeance.time;
        film = films[chosenSeance.seanceData.movieId];
    }

    const [isToDoBig, setToDoBig] = useState(false);
   // console.log("Hall chosenSeance", chosenSeance);


    const toggleBig = (e) => {
        if (e.target.classList.contains("toBig")) {
            setToDoBig(true);
        }
        else {
            setToDoBig(false);
        }
    };

    const toDo =()=>{
        console.log("toDo")
    }

    return (
        <main onClick={toggleBig}>
            {chosenSeance.seanceData ? <section className="buying">
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
                    <HallScheme/>

                    <div className="buying-scheme__legend">
                        <div className="col">
                            <PriceLegend status={placesType.standard}/>
                            <PriceLegend status={placesType.vip}/>
                        </div>
                        <div className="col">
                            <PriceLegend status={placesType.taken}/>
                            <PriceLegend status={placesType.selected}/>
                        </div>
                    </div>
                </div>
                <Link to={"/ticket"}><MyButton text="Забронировать" onClick={toDo}/></Link>
            </section> : ""}
        </main>
    );
}