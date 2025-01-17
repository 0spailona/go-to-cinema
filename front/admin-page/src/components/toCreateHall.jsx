import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import MyPopup from "./common/myPopup.jsx";
import MyInput from "./common/myInput.jsx";
import {//fetchHalls,
    fetchNewHall, removeHall, setHalls, setLoadingHalls
} from "../redux/slices/halls.js";
import Loader from "react-js-loader";
import {createHall, getHalls} from "../js/api.js";

export default function ToCreateHall() {

    const dispatch = useDispatch();

    const {halls,loadingHalls,hallConfig} = useSelector(state => state.halls);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [hallForRemove, setHallForRemove] = useState(null);

    const [inputValueNameHall, setInputValueNameHall] = useState("");

    const getHallsFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoadingHalls(false));
    };

    const createNewHall = async (e) => {
        e.preventDefault();

        setShowPopupForAdd(false);
        setInputValueNameHall("");
        const formData = new FormData(e.currentTarget);
        const name = Object.fromEntries(formData).name;

        dispatch(setLoadingHalls(true));

        const response = await createHall(name);
        if (response.status !== "success") {
            //TODO ERROR
        }

        //dispatch(fetchNewHall(content))
        await getHallsFromServer()
        dispatch(setLoadingHalls(false));
    };

    const removeOneHall = async (e) => {
        e.preventDefault();
        setShowPopupForRemove(false);
        console.log("hallForREmove", hallForRemove)
        dispatch(removeHall(hallForRemove))
        // dispatch(fetchHalls());
        setHallForRemove(null);
        await getHallsFromServer()
    };

    const onResetForAdd = () => {
        setShowPopupForAdd(false);
        setInputValueNameHall("");
    };

    const onResetForRemove = () => {
        setShowPopupForRemove(false);
        setHallForRemove(null);
    };

    //console.log("toCreateHall hallForRemove",hallForRemove);
   // console.log("toCreateHall halls",halls);

    return (
        <>
            <MyPopup isVisible={showPopupForAdd} title="Добавление зала"
                     onClose={() => onResetForAdd()}
                     onSubmit={(e) => createNewHall(e)}
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
                     onSubmit={(e) => removeOneHall(e)}
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
                            {Object.keys(halls).map((hallId) => <li key={hallId}>{halls[hallId].name}{"\u00A0"}
                                <MyButton type={"trash"} onclick={() => {
                                    setHallForRemove(hallId);
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