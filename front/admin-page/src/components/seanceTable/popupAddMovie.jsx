import MyInput from "../common/myInput.jsx";
import MyPopup from "../common/myPopup.jsx";
import {useState} from "react";
import {getValidationError} from "../../js/utils.js";
import {sendPosterToServer} from "../../js/api.js";
import {useDispatch} from "react-redux";
import {setError} from "../../redux/slices/common.js";


export default function PopupAddMovie({showPopup, onReset, onSubmit, onError, closePopup}) {

    const [inputTitle, setInputTitle] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputCountry, setInputCountry] = useState("");
    const [inputRelease, setInputRelease] = useState("");
    const [posterRandom, setPosterRandom] = useState(0);

    const dispatch = useDispatch();

    const onSubmitAdd = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = Object.fromEntries(formData).title.trim();
        const description = Object.fromEntries(formData).description.trim();
        const country = Object.fromEntries(formData).country.trim();
        const duration = +Object.fromEntries(formData).duration.trim();
        const releaseYear = +Object.fromEntries(formData).releaseYear.trim();
        const durationError = getValidationError(duration, 10, 250);
        const yearNow = +new Date().getFullYear();
        const releaseYearError = getValidationError(releaseYear, 1895, yearNow);
        if (durationError) {
            onError(`Ошибка в поле "Продолжительность фильма". ${durationError}`);
        }
        else if (releaseYearError) {
            onError(`Ошибка в поле "Год релиза". ${releaseYearError}`);
        }
        else {
            onSubmit({title, description, country, duration, releaseYear});
            cleanForm();
        }
    };

    const onResetAdd = (e) => {
        e.preventDefault();
        cleanForm();
        onReset();
    };

    const cleanForm = () => {
        setInputTitle("");
        setInputDescription("");
        setInputCountry("");
        setInputTime("");
        setInputRelease("");
    };

    async function sendPoster(poster) {
        if(!poster){
            return;
        }
        const formData = new FormData();
        formData.append("poster", poster);
        const response = await sendPosterToServer(formData);

        if (response.status === "success") {
            setPosterRandom(Math.random());
        }
        else {
            dispatch(setError(response.message));
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
                 uploadBtnData={{
                     text: "Загрузить постер", name: "poster",
                     uploadFile: (poster) => sendPoster(poster)
                 }}
                 onReset={e => onResetAdd(e)}
                 onSubmit={e => onSubmitAdd(e)}>
            <div className="popup__container">
                <div className="popup__poster"
                     style={{backgroundImage: `url(api/posterBySession?${posterRandom})`}}>
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