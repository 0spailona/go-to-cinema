import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import MyPopup from "./common/myPopup.jsx";
import MyInput from "./common/myInput.jsx";
import {fetchHalls, fetchNewHall, removeHallByName} from "../redux/slices/halls.js";
import Loader from "react-js-loader";

export default function ToCreateHall() {

    const dispatch = useDispatch();

    const {halls,loadingHalls,hallConfig} = useSelector(state => state.halls);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [hallForRemove, setHallForRemove] = useState(null);

    const [inputValueNameHall, setInputValueNameHall] = useState("");

    const createHall = (e) => {
        e.preventDefault();
        setShowPopupForAdd(false);
        setInputValueNameHall("");
        const formdata = new FormData(e.currentTarget);
        const content = Object.fromEntries(formdata).name;
        dispatch(fetchNewHall(content))
        dispatch(fetchHalls());
    };

    const removeHall = (e) => {
        e.preventDefault();
        setShowPopupForRemove(false);
        dispatch(removeHallByName(hallForRemove))
        dispatch(fetchHalls());
        setHallForRemove(null);
    };

    const onResetForAdd = () => {
        setShowPopupForAdd(false);
        setInputValueNameHall("");
    };

    const onResetForRemove = () => {
        setShowPopupForRemove(false);
        setHallForRemove(null);
    };

    return (
        <>
            <MyPopup isVisible={showPopupForAdd} title="Добавление зала"
                     onClose={() => onResetForAdd()}
                     onSubmit={(e) => createHall(e)}
                     onReset={() => onResetForAdd()}
                     textForSubmitBtn="Добавить зал"
                     textForResetBtn="Отменить">
                <MyInput label={`Название зала. Не менее ${hallConfig.hallNameLength.min} и не более ${hallConfig.hallNameLength.max} символов`}
                         placeholder="Например, &laquo;Зал 1&raquo;"
                         value={inputValueNameHall} name="name" size="full"
                         isRequired={true} max={`${hallConfig.hallNameLength.max}`}
                         min={`${hallConfig.hallNameLength.min}`}
                         onChange={e => setInputValueNameHall(e.target.value)}/>
            </MyPopup>
            <MyPopup isVisible={showPopupForRemove} title="Удаление зала"
                     onClose={() => onResetForRemove()}
                     onSubmit={(e) => removeHall(e)}
                     onReset={() => onResetForRemove()}
                     textForSubmitBtn="Удалить"
                     textForResetBtn="Отменить">
                <p className="conf-step__paragraph">Вы действительно хотите удалить
                    зал <span>"{hallForRemove ? halls[hallForRemove].name : ""}"</span>?
                </p>
            </MyPopup>
            <section className="conf-step">
                <ConfStepHeader title="Управление залами"/>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">Доступные залы:</p>
                    {loadingHalls?
                        <div className="loader">
                            <Loader type="bubble-scale" bgColor="#63536C" color="#FFFFFF"
                                    size={50}/>
                        </div> :
                        halls && Object.keys(halls).length > 0 ? <ul className="conf-step__list">
                            {Object.keys(halls).map((hallName) => <li key={hallName}>{hallName}{"\u00A0"}
                                <MyButton type={"trash"} onclick={() => {
                                    setHallForRemove(hallName);
                                    setShowPopupForRemove(true);
                                }}/>
                            </li>)}
                        </ul> :
                        <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
                    <MyButton text="Создать зал" type="submit" onclick={() => setShowPopupForAdd(true)}/>
                </div>
            </section>
        </>
    );
}