import CloseImg from "../../assets/i/close.png"
import MyButton from "./myButton.jsx";
import UploadButton from "./UploadButton.jsx";


export default function MyPopup({isVisible,children,title,onClose,onSubmit,onReset,textForSubmitBtn,textForResetBtn,textForAddContent}) {



    return (
        <div className={`popup ${isVisible?"active":""}`}>
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            {title}
                            <a className="popup__dismiss" href="#"><img src={CloseImg} alt="Закрыть" onClick={onClose}/></a>
                        </h2>
                    </div>
                    <div className="popup__wrapper">
                        <form onSubmit={onSubmit} onReset={onReset}>
                            {children}
                            <div className="conf-step__buttons text-center">
                                <MyButton text={textForSubmitBtn} type="submit"/>
                                {textForAddContent &&
                                    <UploadButton/>}
                                <MyButton text={textForResetBtn} type="reset" onclick={onReset}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}