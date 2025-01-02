import MyPopup from "../common/myPopup.jsx";
import {useDispatch, useSelector} from "react-redux";
import {removeFilm, removeMovieFromList} from "../../redux/slices/films.js";

export default function PopupRemoveFilm({showPopup,title, closePopup,onReset,onSubmit}) {

    console.log("removeMovieFromList title",title);

    return (
        <MyPopup isVisible={showPopup} title="Удаление фильма"
                 onClose={closePopup}
                 textForSubmitBtn="Удалить"
                 textForResetBtn="Отменить"
                 onReset={e => onReset(e)}
                 onSubmit={e => onSubmit(e)}>
            <p className="conf-step__paragraph">Вы действительно хотите удалить фильм <span>"{title}"</span>?
            </p>
        </MyPopup>
    );
}