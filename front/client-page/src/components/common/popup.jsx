import CloseImg from "../../assets/i/close.png";

export default function Popup({message, isVisible, onClose}) {

    return (
        <div className={`popup ${isVisible ? "active" : ""}`}>
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            {message}
                            <div className="popup__dismiss">
                                <img  src={CloseImg} alt="Закрыть" onClick={onClose}/></div>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
* <a className="popup__dismiss" href="/">
                                <img src={CloseImg} alt="Закрыть" onClick={onClose}/>
                            </a>*/