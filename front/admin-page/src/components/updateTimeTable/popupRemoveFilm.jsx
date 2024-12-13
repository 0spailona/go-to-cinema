import MyPopup from "../common/myPopup.jsx";
import {useDispatch, useSelector} from "react-redux";
import {removeFilm} from "../../redux/slices/films.js";

export default function PopupRemoveFilm({showPopup,movieId, closePopup}) {

    const dispatch = useDispatch();

    const {films} = useSelector(state => state.films);
    const film = films[movieId]

    const onResetRemove = (e) => {
        e.preventDefault();
        console.log("onResetRemove");
        closePopup();
    };

    const onSubmitRemove = (e) => {
        e.preventDefault();
        dispatch(removeFilm(movieId));
        closePopup();
    };

    return (
        <MyPopup isVisible={showPopup} title="Удаление фильма"
                 onClose={closePopup}
                 textForSubmitBtn="Удалить"
                 textForResetBtn="Отменить"
                 onReset={e => onResetRemove(e)}
                 onSubmit={e => onSubmitRemove(e)}>
            <p className="conf-step__paragraph">Вы действительно хотите удалить фильм <span>"{film?.title}"</span>?
            </p>
        </MyPopup>
    );
}