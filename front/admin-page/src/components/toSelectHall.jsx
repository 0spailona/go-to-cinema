import {useState} from "react";
//import {useAppDispatch, useAppSelector} from "../../redux/hooks.js";
import {changeSelectedHall} from "../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import MyPopup from "./common/myPopup.jsx";
import {selectedHallType} from "../js/info.js";

export default function ToSelectHall({name}) {

    const dispatch = useDispatch();

    const {
        halls, chairsUpdateHall, pricesUpdateHall
    } = useSelector(state => state.halls);

    const checkedHall = name === selectedHallType.chairs ? chairsUpdateHall : pricesUpdateHall;

    const [checkedHallId, setCheckedHallId] = useState(checkedHall.id);
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallId, setNextCheckedHallId] = useState(checkedHallId);


    //console.log("render", halls);
    console.log("ToSelectHall name", name);
    const isSaveUpdates = (result) => {
        console.log("result popup", result);
        //todo send from redux to server or not
        setShowPopup(false);
        setCheckedHallId(nextCheckedHallId)
        dispatch(changeSelectedHall({name: name, hallId: nextCheckedHallId}));
    };
    return (
        <>
            <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале ${halls[checkedHall.id]}`}
                     onClose={() => setShowPopup(false)}/>
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {
                    Object.keys(halls).map((id) =>
                        <li key={id}>
                            <input type="radio" className="conf-step__radio"
                                   name={name}
                                   value={halls[id].name}
                                   checked={id === checkedHallId}
                                   onChange={() => {

                                       if (checkedHall.isUpdated) {
                                           setShowPopup(true);
                                           setNextCheckedHallId(id);
                                       }
                                       else {
                                           setCheckedHallId(id);
                                           dispatch(changeSelectedHall({name: name, hallId: id}));
                                       }
                                   }}
                            />
                            <span className="conf-step__selector">{halls[id].name}</span>
                        </li>)
                }
            </ul>
        </>
    );
}