import MyPopup from "../common/myPopup.jsx";
import {useDispatch, useSelector} from "react-redux";
//import {removeFilm, removeFilmFromSeanceHall} from "../../redux/slices/movies.js";

export default function PopupRemoveMovieFromSeances({showPopup, closePopup,onSubmit,onReset,title}) {

    return (
        <MyPopup isVisible={showPopup} title="Снятие с сеанса"
                 onClose={closePopup}
                 textForSubmitBtn="Удалить"
                 textForResetBtn="Отменить"
                 onReset={e => onReset(e)}
                 onSubmit={e => onSubmit(e)}>
            <p className="conf-step__paragraph">Вы действительно хотите снять с сеанса фильм <span>"{title}"</span>?
            </p>
        </MyPopup>
    );
}