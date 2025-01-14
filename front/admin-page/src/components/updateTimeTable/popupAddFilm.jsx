import MyInput from "../common/myInput.jsx";
import MyPopup from "../common/myPopup.jsx";
import {useEffect, useState} from "react";
import {getValidationError} from "../../js/utils.js";
import {useDispatch, useSelector} from "react-redux";
//import {getPoster, uploadPoster} from "../../redux/slices/films.js";
import {fetchToken} from "../../redux/utils.js";

const basedUrl = "admin/";
//console.log("basedUrl", basedUrl);
const token = await fetchToken();

export default function PopupAddFilm({showPopup, onReset,onSubmit,onError,closePopup}) {

   /* useEffect(()=>{
        if(showPopup){
            dispatch(getPoster())
        }
    },[showPopup])*/

    //const dispatch = useDispatch();

    const [inputTitle, setInputTitle] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputCountry, setInputCountry] = useState("");
    const [inputRelease, setInputRelease] = useState("");
    const [posterRandom, setPosterRandom] = useState(0);


    const onSubmitAdd = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget);
        const title = Object.fromEntries(formdata).title.trim();
        const description = Object.fromEntries(formdata).description.trim();
        const country = Object.fromEntries(formdata).country.trim();
        const duration = +Object.fromEntries(formdata).duration.trim();
        const releaseYear = +Object.fromEntries(formdata).releaseYear.trim();
        const durationError = getValidationError(duration,10,250)
        const yearNow = +new Date().getFullYear();
        const releaseYearError = getValidationError(releaseYear,1895,yearNow)
        if (durationError) {
           onError(`Ошибка в поле "Продолжительность фильма". ${durationError}`);
        }
        else if(releaseYearError) {
            onError(`Ошибка в поле "Год релиза". ${releaseYearError}`);
        }
        else{
            //onSubmit({title, description, country, duration,poster})
            onSubmit({title, description, country, duration,releaseYear})
            cleanForm();
        }

    };

    const onResetAdd = (e) => {
        e.preventDefault();
        cleanForm();
        onReset()
    };

    const cleanForm = () => {
        setInputTitle("");
        //setPoster(null);
        setInputDescription("");
        setInputCountry("");
        setInputTime("");
        setInputRelease("")
    };

     async function sendPoster (poster)  {
        const formData = new FormData();
        formData.append("poster", poster);
        //const response = async (formData) => {
           // console.log("uploadPoster formData", Object.fromEntries(formData).poster);
            const response = await fetch(`${basedUrl}api/poster`, {
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": token,
                },
                method: "POST",
                credentials: "same-origin",
                body: formData,
            });
            if(response.status === 200) {
                setPosterRandom(Math.random())
            }
            else{
                //TODO ERROR fro 413 (too large) and 415 (wrong mime-type) and other (another error)
            }
    }

    return (
        <MyPopup isVisible={showPopup} title="Добавление фильма"
                 onClose={() => {
                     cleanForm();
                     closePopup();
                 }}
                 textForSubmitBtn="Добавить фильм"
                 textForResetBtn="Отменить"
                 textForAddContent="Загрузить постер"
                 uploadBtnData={{text: "Загрузить постер", name: "poster",
                     uploadFile: (poster) => sendPoster(poster)
        }}
                 onReset={e => onResetAdd(e)}
                 onSubmit={e => onSubmitAdd(e)}>
            <div className="popup__container">
                <div className="popup__poster" style={{backgroundImage: `url(admin/api/posterBySession?${posterRandom})`}}>
                </div>
                <div className="popup__form">
                    <MyInput label="Название фильма" name="title" size="full" isRequired={true}
                             placeholder="Например, &laquo;Гражданин Кейн&raquo;" value={inputTitle}
                             onChange={e => setInputTitle(e.target.value)}/>
                    <MyInput label="Продолжительность фильма (мин.)" name="duration" size="full"
                             isRequired={true}
                             value={inputTime}
                             onChange={e => setInputTime(e.target.value)}/>
                    <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                        Описание фильма
                        <textarea className="conf-step__input" name="description" required
                                  value={inputDescription}
                                  onChange={e => setInputDescription(e.target.value)}>

                        </textarea>
                    </label>
                    <MyInput label="Страна" name="country" size="full" isRequired={true}
                             value={inputCountry} onChange={e => setInputCountry(e.target.value)}/>
                    <MyInput label="Год релиза" name="releaseYear" size="full" isRequired={true}
                             value={inputRelease} onChange={e => setInputRelease(e.target.value)}/>
                </div>
            </div>
        </MyPopup>
    );
}