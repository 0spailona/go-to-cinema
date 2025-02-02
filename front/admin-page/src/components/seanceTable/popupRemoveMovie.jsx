import MyPopup from "../common/myPopup.jsx";

export default function PopupRemoveMovie({showPopup, title, closePopup, onReset, onSubmit}) {

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