import MyButton from "../common/MyButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import TicketInfo from "./ticketInfo.jsx";
import Hint from "./hint.jsx";
import {setChosenSeance, setError, setInitialChosenSeance, setLoading} from "../../redux/slices/cinema.js";
import {useEffect, useState} from "react";
import {getDateStringFromDate, getStartTimeStringFromMinutes} from "../../js/utils.js";
import {getHallById, getMovieById, getSeanceById, toBook} from "../../js/api.js";
import Loader from "react-js-loader";
import Popup from "../common/popup.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import TicketContent from "./ticketContent.jsx";



export default function Ticket() {

    const location = useLocation();
    const dispatch = useDispatch();
    const query = new URLSearchParams(location.search);

    const seanceId = query.get("seanceId");
    const selected = query.get("places").split(",").map(item => item.split("_")).map(item => {
        const rowIndex = parseInt(item[0]);
        const placeIndex = parseInt(item[1]);

        if (!isNaN(rowIndex) && !isNaN(placeIndex)) {
            return {
                rowIndex, placeIndex
            };
        }
        else {
            dispatch(setError("Что-то пошло не так"));
        }

    });


    //console.log("selected", selected);
    //console.log("ticket seanceId", seanceId);

    const {
        isDrawPage,
        error
    } = useSelector(state => state.cinema);


    const [errorView, setErrorView] = useState({isError: false, message: ""});

    useEffect(() => {
        if (!error) {
            setErrorView({isError: false, message: ""});
        }
        if (error) {
            setErrorView({isError: true, message: error});
        }
    }, [error]);

    if (!seanceId || selected.length === 0) {
        return <Popup isVisible={true} message="Что-то пошло не так"
                      onClose={() => {
                          navigate("/");
                      }}/>;
    }

    if (!isDrawPage) {
        return <p className="info">Продажа билетов временно приостановлена</p>;
    }


    //console.log("ticket chosenSeance", chosenSeance);
    return (
        <> <Popup isVisible={errorView.isError} message={errorView.message}
                  onClose={() => {
                      setErrorView({isError: false, message: ""});
                      navigate("/");
                  }}/>
            <TicketContent selectedPlaces={selected} seanceId={seanceId}/></>
    );

}