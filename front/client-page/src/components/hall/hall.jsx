import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";
import MyButton from "../common/MyButton.jsx";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import {setChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {getSeanceById} from "../../js/api.js";
import Loader from "react-js-loader";
import Popup from "../common/popup.jsx";


export default function Hall() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {chosenSeance, halls, movies, isDrawPage, loading, lastIsDrawPage} = useSelector(state => state.cinema);
    const [isToDoBig, setToDoBig] = useState(false);
    const [error, setError] = useState({isError: false, message: ""});
    //const params = useParams();
    let hall, time, movie;

    if (!chosenSeance.seanceData
        // && !params.id
    ) {
      return  <Popup isVisible={true} message="Что-то пошло не так"
               onClose={() => navigate("/")}/>
        //setError({isError: true, message: "Что-то пошло не так"});
        //navigate("/")
        //return <Navigate to="/"/>;
    }
   /* const getSeance = async (id) => {
        dispatch(setLoading(true));
        const response = await getSeanceById(id);
        if (response.status === "success") {
            dispatch(setChosenSeance(response.data));
            dispatch(setLoading(false));
            return true;
        }
        else {
            dispatch(setChosenSeance(null));
            dispatch(setLoading(false));
            return false;
        }
    };*/

    /*useEffect(() => {
        async function startDraw() {
            if (!chosenSeance.seanceData
               // && !params.id
            ) {
                setError({isError: true, message: "Что-то пошло не так"});
                //navigate("/")
                //return <Navigate to="/"/>;
            }
            /*else {
                if (!await getSeance(params.id)) {
                    setError({isError: true, message: "Что-то пошло не так"});
                }
            }*/
      /*  }

        startDraw();
    }, []);*/

    //if (chosenSeance.seanceData) {
        hall = halls[chosenSeance.seanceData.hallId];
        time = getStartTimeStringFromMinutes(chosenSeance.seanceData.startTime);
        movie = movies[chosenSeance.seanceData.movieId];
    //}


   /* useEffect(() => {
        if (isDrawPage && !lastIsDrawPage) {
            async function toGetUpdateSeance() {
                if (chosenSeance.seanceData) {
                    if (!await getSeance(chosenSeance.seanceData.id)) {
                        setError({isError: true, message: "Что-то пошло не так"});
                    }
                }
            }

            toGetUpdateSeance();
        }
    }, [isDrawPage]);*/

    const toggleBig = (e) => {
        if (e.target.classList.contains("toBig")) {
            setToDoBig(true);
        }
        else {
            setToDoBig(false);
        }
    };

    const onBooking = () => {
        console.log("hall onBooking chosenSeance",chosenSeance);
        if(chosenSeance.selectedPlaces.length > 0){
            navigate("/ticket")
        }
        else {setError({isError: true, message: "Выберите, пожалуйста, места"});}
    }

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
                                        <PriceLegend status={placesType.standard} prices={hall.prices} />
                                        <PriceLegend status={placesType.vip} prices={hall.prices}/>
                                    </div>
                                    <div className="col">
                                        <PriceLegend status={placesType.taken}/>
                                        <PriceLegend status={placesType.selected}/>
                                    </div>
                                </div>
                            </div>
                          <MyButton text="Забронировать" onClick={onBooking}/>
                        </section> : ""}
                    </main>
                :
                <p className="info">Продажа билетов временно приостановлена</p>}
        </>
    );
}