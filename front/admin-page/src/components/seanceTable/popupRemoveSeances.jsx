import MyPopup from "../common/myPopup.jsx";

export default function PopupRemoveSeances({showPopup, closePopup,onSubmit,onReset,title}) {

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