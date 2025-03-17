import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import Popup from "../common/popup.jsx";
import SeanceHallContent from "./seanceHallContent.jsx";

export default function SeanceHall() {

    const navigate = useNavigate();
    const location = useLocation();
    const {isDrawPage} = useSelector(state => state.cinema);
    const query = new URLSearchParams(location.search);

    const seanceId = query.get("seanceId");

    if (!isDrawPage) {
        return <p className="info">Продажа билетов временно приостановлена</p>;
    }

    if (!seanceId) {
        return <Popup isVisible={true} message="Что-то пошло не так"
                      onClose={() => navigate("/")}/>;
    }

    return <SeanceHallContent seanceId={seanceId}/>;
}
