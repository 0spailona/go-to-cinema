import MyPopup from "../common/myPopup.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getFilmsByDate, removeFilm, resetUpdateSeancesByDate} from "../../redux/slices/films.js";


export default function PopupUpdateDate({showPopup,lastChosenDate,onReset,onSubmit, closePopup}){

    const getDateInFormat = (string) => {
        if (!string) {
            return "";
        }
        const newDate = new Date(string);
        return `${newDate.getDate()}. ${newDate.getMonth() + 1}. ${newDate.getFullYear()}`;
    };


    return (
        <MyPopup isVisible={showPopup} title="Вы хотите поменять дату"
                 onClose={closePopup}
                 textForSubmitBtn="Сохранить изменения"
                 textForResetBtn="Не сохранять"
                 onReset={e=>onReset(e)}
                 onSubmit={e=>onSubmit(e)}>
            <p className="conf-step__paragraph">Сохранить изменения в расписании на  <span>{getDateInFormat(lastChosenDate)}</span>?
            </p>
        </MyPopup>
    )
}