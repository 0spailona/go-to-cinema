import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HallScheme from "./hallScheme.jsx";
import PriceLegend from "./priceLegend.jsx";
import {placesType} from "../../js/info.js";
import MyButton from "../common/MyButton.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {getStartTimeStringFromMinutes} from "../../js/utils.js";
import Loader from "react-js-loader";
import Popup from "../common/popup.jsx";
import {setChosenSeance, setError, setInitialChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {getHallById, getMovieById, getSeanceById} from "../../js/api.js";
import SeanceHallContent from "./seanceHallContent.jsx";

let hall, time, movie;



export default function SeanceHall() {

    const navigate = useNavigate();
    const location = useLocation();
    const { isDrawPage } = useSelector(state => state.cinema);
    const query = new URLSearchParams(location.search);

    const seanceId = query.get("seanceId");

    if (!isDrawPage) {
        return <p className="info">Продажа билетов временно приостановлена</p>;
    }

    if (!seanceId) {
        return <Popup isVisible={true} message="Что-то пошло не так"
                      onClose={() => navigate("/")}/>;
    }
    //console.log("query",seanceId);
    return <SeanceHallContent seanceId={seanceId}/>;
}
