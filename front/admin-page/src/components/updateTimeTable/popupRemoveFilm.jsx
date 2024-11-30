import MyPopup from "../common/myPopup.jsx";
import {useState} from "react";

export default function PopupRemoveFilm({showPopup, closePopup}) {

    const [filmForRemove, setFilmForRemove] = useState(null);

    const onResetRemove = (e) => {
        e.preventDefault();
        console.log("onResetRemove");
        closePopup();
        //setShowPopupForRemove(false);
    };

    const onSubmitRemove = (e) => {
        e.preventDefault();
        console.log("onSubmitRemove");
        closePopup();
        //setShowPopupForRemove(false);
    };
    return (
        <MyPopup isVisible={showPopup} title="Удаление фильма"
                 onClose={closePopup}
                 textForSubmitBtn="Удалить"
                 textForResetBtn="Отменить"
                 onReset={e => onResetRemove(e)}
                 onSubmit={e => onSubmitRemove(e)}>
            <p className="conf-step__paragraph">Вы действительно хотите удалить фильм <span>"Название фильма"</span>?
            </p>
        </MyPopup>
    );
}