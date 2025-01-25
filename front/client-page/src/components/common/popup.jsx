import CloseImg from "../../assets/i/close.png";
import MyButton from "./MyButton.jsx";

export default function Popup({
                                    message,isVisible,onClose
                                }) {

    //console.log("MyPopup isVisible",isVisible)

    return (
        <div className={`popup ${isVisible ? "active" : ""}`}>
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            {message}
                            <a className="popup__dismiss" href="/"><img src={CloseImg} alt="Закрыть" onClick={onClose}/></a>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}