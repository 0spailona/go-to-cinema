import MyInput from "../common/myInput.jsx";
import MyPopup from "../common/myPopup.jsx";
import {useState} from "react";
import {isValid} from "../../js/utils.js";
import {useDispatch} from "react-redux";
import {addNewFilm} from "../../redux/slices/films.js";

export default function PopupAddFilm({showPopup, closePopup}) {

    const dispatch = useDispatch();

    const [inputTitle, setInputTitle] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputCountry, setInputCountry] = useState("");
    const [poster, setPoster] = useState(null);

    const onSubmitAdd = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget);
        const title = Object.fromEntries(formdata).title.trim();
        const description = Object.fromEntries(formdata).description.trim();
        const country = Object.fromEntries(formdata).country.trim();
        const time = +Object.fromEntries(formdata).duration.trim();
        if (isValid(time)) {
            dispatch(addNewFilm({title, description, country, time,poster}));
            closePopup();
            cleanForm();

        }
    };

    const onResetAdd = (e) => {
        e.preventDefault();
        cleanForm();
        closePopup();
    };

    const cleanForm = () => {
        setInputTitle("");
        setPoster(null);
        setInputDescription("");
        setInputCountry("");
        setInputTime("");
    };

    return (
        <MyPopup isVisible={showPopup} title="Добавление фильма"
                 onClose={() => {
                     cleanForm();
                     closePopup();
                 }}
                 textForSubmitBtn="Добавить фильм"
                 textForResetBtn="Отменить"
                 textForAddContent="Загрузить постер"
                 uploadBtnData={{text: "Загрузить постер", name: "poster", getData: (poster) => setPoster(poster)}}
                 onReset={e => onResetAdd(e)}
                 onSubmit={e => onSubmitAdd(e)}>
            <div className="popup__container">
                <div className="popup__poster"></div>
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
                </div>
            </div>
        </MyPopup>
    );
}