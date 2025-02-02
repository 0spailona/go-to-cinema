import MyPopup from "../common/myPopup.jsx";

export default function PopupError({showPopup,text, closePopup}) {

    return (
        <MyPopup isVisible={showPopup} title="Ошибка!"
                 onClose={closePopup}>
            <p className="conf-step__paragraph">{text}
            </p>
        </MyPopup>
    );
}