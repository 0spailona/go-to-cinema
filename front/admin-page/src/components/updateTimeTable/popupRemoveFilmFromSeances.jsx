import MyPopup from "../common/myPopup.jsx";
import {useDispatch, useSelector} from "react-redux";
import {removeFilm, removeFilmFromSeanceHall} from "../../redux/slices/films.js";

export default function PopupRemoveFilmFromSeances({showPopup,filmIndex,hallId, closePopup,filmName}) {


    const dispatch = useDispatch();

    const onResetRemove = (e) => {
        e.preventDefault();
        console.log("onResetRemove");
        closePopup();
    };

    const onSubmitRemove = (e) => {
        e.preventDefault();
        dispatch(removeFilmFromSeanceHall({filmIndex, hallId}));
        closePopup();
    };

    return (
        <MyPopup isVisible={showPopup} title="Снятие с сеанса"
                 onClose={closePopup}
                 textForSubmitBtn="Удалить"
                 textForResetBtn="Отменить"
                 onReset={e => onResetRemove(e)}
                 onSubmit={e => onSubmitRemove(e)}>
            <p className="conf-step__paragraph">Вы действительно хотите снять с сеанса фильм <span>"{filmName}"</span>?
            </p>
        </MyPopup>
    );
}