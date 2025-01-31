import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";
import MyButton from "../common/MyButton.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import {setChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {getSeanceById} from "../../js/api.js";
import Loader from "react-js-loader";
import Popup from "../common/popup.jsx";


export default function Hall() {

    const dispatch = useDispatch();
    const {chosenSeance, halls, movies, isDrawPage, loading, lastIsDrawPage} = useSelector(state => state.cinema);
    const [isToDoBig, setToDoBig] = useState(false);
    const [error, setError] = useState({isError: false, message: ""});
    const params = useParams();
    let hall, time, movie;
    //console.log("hall params", params);
    //console.log("hall chosenSeance.seanceData", chosenSeance.seanceData);

    const getSeance = async (id) => {
        dispatch(setLoading(true));
        const response = await getSeanceById(id);
        if (response.status === "success") {
            dispatch(setChosenSeance(response.data));
            dispatch(setLoading(false));
            return true;
        }
        else {
            //console.log("hall getSeance",response.status);
            dispatch(setChosenSeance(null));
            dispatch(setLoading(false));
            return false;
        }
    };



    useEffect(() => {
        async function startDraw() {
            if (!chosenSeance.seanceData && !params.id) {
                setError({isError: true, message: "Что-то пошло не так"});
                console.log("no seances selected");
                return <Navigate to="/"/>;
            }
            else {
                if (!await getSeance(params.id)) {
                    setError({isError: true, message: "Что-то пошло не так"});
                    console.log("seance was not found");
                }


                //console.log("hall chosenSeance",chosenSeance)
            }
        }

        startDraw();
    }, []);

    if (chosenSeance.seanceData) {
        hall = halls[chosenSeance.seanceData.hallId];
        time = getStartTimeStringFromMinutes(chosenSeance.seanceData.startTime);
        movie = movies[chosenSeance.seanceData.movieId];
    }


    useEffect(() => {
        if (isDrawPage && !lastIsDrawPage) {
            async function toGetUpdateSeance() {
                if (chosenSeance.seanceData) {
                    if (!await getSeance(chosenSeance.seanceData.id)) {
                        setError({isError: true, message: "Что-то пошло не так"});
                        console.log("seance was not found");
                    }
                }
            }

            toGetUpdateSeance();
        }
    }, [isDrawPage]);


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
        <>
            <Popup isVisible={error.isError} message={error.message}
                   onClose={() => setError({isError: false, message: ""})}/>

            {isDrawPage ?
                loading ?
                    <div className="loader">
                        <Loader type="bubble-scale" bgColor="rgba(241, 235, 230, 0.95)" color="#FFFFFF"
                                size={50}/>
                    </div> :
                    <main onClick={toggleBig}>
                        {chosenSeance.seanceData ? <section className="buying">
                            <div className="buying__info">
                                <div className="buying__info-description">
                                    <h2 className="buying__info-title">{movie?.title}</h2>
                                    <p className="buying__info-start">Начало сеанса: {time.hours}:{time.min}</p>
                                    <p className="buying__info-hall">{hall?.name}</p>
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
                <p className="info">Продажа билетов временно приостановлена</p>}
        </>
    );
}