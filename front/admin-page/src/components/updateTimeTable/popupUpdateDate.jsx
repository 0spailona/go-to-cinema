import MyPopup from "../common/myPopup.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getFilmsByDate, removeFilm, resetUpdateSeancesByDate} from "../../redux/slices/films.js";


export default function PopupUpdateDate({showPopup,lastChosenDate, newChosenDate, closePopup}){

    const dispatch = useDispatch();

    const getDateInFormat = (string) => {
        if (!string) {
            return "";
        }
        const newDate = new Date(string);
        return `${newDate.getDate()}. ${newDate.getMonth() + 1}. ${newDate.getFullYear()}`;
    };

    const onReset = (e) => {
        e.preventDefault();
        dispatch(resetUpdateSeancesByDate(lastChosenDate));
        dispatch(getFilmsByDate(newChosenDate.toISOString()));
       // console.log("onReset");
        closePopup();
    };

    const onSubmit = (e) => {
        e.preventDefault();
        //console.log()
        dispatch(getFilmsByDate(newChosenDate.toISOString()));
       // dispatch(removeFilm(movieId));
        closePopup();
    };

    return (
        <MyPopup isVisible={showPopup} title="Вы хотите поменять дату"
                 onClose={closePopup}
                 textForSubmitBtn="Сохранить изменения"
                 textForResetBtn="Не сохранять"
                 onReset={onReset}
                 onSubmit={onSubmit}>
            <p className="conf-step__paragraph">Сохранить изменения в расписании на  <span>{getDateInFormat(lastChosenDate)}</span>?
            </p>
        </MyPopup>
    )
}