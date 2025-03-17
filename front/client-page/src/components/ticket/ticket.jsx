import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Popup from "../common/popup.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import TicketContent from "./ticketContent.jsx";
import {checkPlaces} from "../../js/api.js";


export default function Ticket() {

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const {
        isDrawPage,
    } = useSelector(state => state.cinema);

    const [errorView, setErrorView] = useState({isError: false, message: ""});
    const [selected, setSelected] = useState([]);

    const seanceId = query.get("seanceId");


    useEffect(() => {

        const places = query.get("places");
        async function checkPlacesOnServer() {
            const response = await checkPlaces(places,seanceId);
            if (response.status === "success") {
                setSelected(response.data)
            }
            else {
                setErrorView({isError: true, message: response.message});
            }
        }

        checkPlacesOnServer()
    }, []);

    if (!seanceId || selected.length === 0) {
        const message = errorView.message.length > 0 ? errorView.message : "Что-то пошло не так";
        return <Popup isVisible={true} message={message}
                      onClose={() => {
                          navigate("/");
                      }}/>;
    }

    if (!isDrawPage) {
        return <p className="info">Продажа билетов временно приостановлена</p>;
    }

    return (
        <> <Popup isVisible={errorView.isError} message={errorView.message}
                  onClose={() => {
                      setErrorView({isError: false, message: ""});
                      navigate("/");
                  }}/>
            <TicketContent selectedPlaces={selected} seanceId={seanceId}/></>
    );

}