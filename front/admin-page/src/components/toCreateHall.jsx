import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import MyPopup from "./common/myPopup.jsx";
import MyInput from "./common/myInput.jsx";
import {createNewHall, removeHallFromState} from "../redux/slices/halls.js";

export default function ToCreateHall() {

    const dispatch = useDispatch();

    const {
        halls,
    } = useSelector(state => state.halls);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [hallForRemove, setHallForRemove] = useState(null);

    const [inputValueNameHall, setInputValueNameHall] = useState("");
    //console.log("ToCreateHall halls", halls);

    const createHall = (e) => {
        e.preventDefault();
        setShowPopupForAdd(false);
        setInputValueNameHall("");
        const formdata = new FormData(e.currentTarget);
        const content = Object.fromEntries(formdata).name;
        dispatch(createNewHall(content));
    };

    const removeHall = (e) => {
        e.preventDefault();
        console.log("remove Hall e", e);
        setShowPopupForRemove(false);
        dispatch(removeHallFromState(hallForRemove));
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
                <MyInput label="Название зала" placeholder="Например, &laquo;Зал 1&raquo;"
                         value={inputValueNameHall} name="name" size="full"
                         isRequired={true}
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
                    <ul className="conf-step__list">
                        {Object.keys(halls).map((id) => <li key={id}>{halls[id].name}{"\u00A0"}
                            <button className="conf-step__button conf-step__button-trash"
                                    onClick={() => {
                                        setHallForRemove(id);
                                        setShowPopupForRemove(true);
                                    }}>
                            </button>
                        </li>)}
                    </ul>
                    <MyButton text="Создать зал" type="submit" onclick={() => setShowPopupForAdd(true)}/>
                </div>
            </section>
        </>
    );
}