import CloseImg from "../../assets/i/close.png";
import MyButton from "./myButton.jsx";
import UploadButton from "./UploadButton.jsx";


export default function MyPopup({
                                    isVisible,
                                    children,
                                    title,
                                    onClose,
                                    onSubmit,
                                    onReset,
                                    textForSubmitBtn,
                                    textForResetBtn,
                                    uploadBtnData
                                }) {

    const getFile = (el) => {
        let file = el.files[0];
        console.log("getFile", file.name);

        uploadBtnData.uploadFile(file)
    };

    //console.log("MyPopup isVisible",isVisible)

    return (
        <div className={`popup ${isVisible ? "active" : ""}`}>
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
                            {onReset && onSubmit ?
                                <div className="conf-step__buttons text-center">
                                    <MyButton text={textForSubmitBtn} type="submit"/>
                                    {uploadBtnData &&
                                        <UploadButton name={uploadBtnData.name}
                                                      text={uploadBtnData.text}
                                                      onChange={e => getFile(e.target)}/>}
                                    <MyButton text={textForResetBtn} type="reset" onclick={onReset}/>
                                </div> : ""
                            }

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}