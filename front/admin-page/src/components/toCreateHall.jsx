import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useSelector} from "react-redux";
import Popup from "reactjs-popup";
import {useState} from "react";
import MyPopup from "./common/myPopup.jsx";

export default function ToCreateHall() {

    const {
        halls,
    } = useSelector(state => state.halls);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [hallForRemove, setHallForRemove] = useState(null);

    console.log("ToCreateHall halls", halls);

    const createHall = () => {
        console.log("Create Hall");
    };

    const removeHall = () => {
        console.log("Create Hall");
    };

    return (
        <>
            <MyPopup isVisible={showPopupForAdd} title="Добавление зала" onClose={() => setShowPopupForAdd(false)}>
                <form>
                    <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                        Название зала
                        <input className="conf-step__input" type="text"
                               placeholder="Например, &laquo;Зал 1&raquo;" name="name" id="name" required/>
                    </label>
                    <div className="conf-step__buttons text-center">
                        <MyButton text="Добавить зал" type="submit"/>
                        <MyButton text="Отменить" type="reset"/>
                    </div>
                </form>
            </MyPopup>
            <MyPopup isVisible={showPopupForRemove} title="Удаление зала" onClose={() => setShowPopupForRemove(false)}>
                <form>
                    <p className="conf-step__paragraph">Вы действительно хотите удалить зал <span>"{hallForRemove ? halls[hallForRemove].name : ""}"</span>?
                    </p>
                    <div className="conf-step__buttons text-center">
                        <MyButton text="Удалить" type="submit"/>
                        <MyButton text="Отменить" type="reset"/>
                    </div>
                </form>
            </MyPopup>
            <section className="conf-step">
                <ConfStepHeader title="Управление залами"/>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">Доступные залы:</p>
                    <ul className="conf-step__list">
                        {Object.keys(halls).map((id) => <li key={id}>{halls[id].name}{"\u00A0"}
                            <button className="conf-step__button conf-step__button-trash"
                                    onClick={()=> {
                                        setHallForRemove(id);
                                        setShowPopupForRemove(true);
                                    }}>

                            </button>
                        </li>)}
                    </ul>
                    <MyButton text="Создать зал" type="submit" onclick={() =>  setShowPopupForAdd(true)}/>
                </div>
            </section>
        </>
    );
}