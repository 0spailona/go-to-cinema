import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";
import MyButton from "../common/MyButton.jsx";
import {Link} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import {setChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {getSeanceById} from "../../js/api.js";


export default function Hall() {

    const dispatch = useDispatch();
    const {chosenSeance, halls, movies, drawPage, seances} = useSelector(state => state.cinema);
    const[lastDrawPage, setLastDrawPage] = useState(drawPage);

    let hall, time, movie;
    //console.log("hall chosenSeance.seanceData", chosenSeance.seanceData);
    if (!chosenSeance.seanceData) {
        console.log("no seances selected");
    }
    else {
        //console.log("hall chosenSeance",chosenSeance)
        hall = halls[chosenSeance.seanceData.hallId];
        //console.log("Hall hall",hall);

        time = getStartTimeStringFromMinutes(chosenSeance.seanceData.startTime);
        //time = chosenSeance.time;
        movie = movies[chosenSeance.seanceData.movieId];
    }

    const getUpdateSeance = async (id) => {
        dispatch(setLoading(true));
        const response = await getSeanceById(id);
        if (response.status === "success") {
            dispatch(setChosenSeance(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoading(false));
        //dispatch(fetchSeanceById(id))
    };

    useEffect(() => {
        //console.log("new drawPage seances", seances);
        if(!drawPage){
            setLastDrawPage(drawPage);
        }
        else if (drawPage && !lastDrawPage) {
            async function toGetUpdateSeance() {
                await getUpdateSeance(chosenSeance.seanceData.id);
            }

            toGetUpdateSeance();
        }
    }, [drawPage]);
    /* const isDrawFilms = async () => {
         dispatch(setLoading(true));
         const response = await isOpenSails();
         if (response.status === "success" && response.data) {
             setDrawMovies(true);
             return true
         }
         else {

             //TODO ERROR
         }
         dispatch(setLoading(false));
         return false;
     };*/

    const [isToDoBig, setToDoBig] = useState(false);
    const [drawMovies, setDrawMovies] = useState(false);
    // console.log("Hall chosenSeance", chosenSeance);
    /*useEffect(() => {
        //console.log("useeffect called");
        async function toStart() {
            //await fetchToken()
            if(await isDrawFilms()) {
            }

        }

        toStart();

    }, []);*/

    const toggleBig = (e) => {
        if (e.target.classList.contains("toBig")) {
            setToDoBig(true);
        }
        else {
            setToDoBig(false);
        }
    };

    const toDo = () => {
        console.log("toDo");
    };

    return (
        <>{drawPage ?
            <main onClick={toggleBig}>
                {chosenSeance.seanceData ? <section className="buying">
                    <div className="buying__info">
                        <div className="buying__info-description">
                            <h2 className="buying__info-title">{movie.title}</h2>
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
            :
            <p>Продажа билетов временно приостановлена</p>}
        </>
    );
}