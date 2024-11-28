import {useState} from "react";
import {changeSelectedHall} from "../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import MyPopup from "./common/myPopup.jsx";
import {selectedHallType} from "../js/info.js";

export default function ToSelectHall({target}) {

    const dispatch = useDispatch();

    const {
        halls, chairsUpdateHall, pricesUpdateHall
    } = useSelector(state => state.halls);

    const checkedHall = target === selectedHallType.chairs ? chairsUpdateHall : pricesUpdateHall;

    const [checkedHallId, setCheckedHallId] = useState(checkedHall.id);
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallId, setNextCheckedHallId] = useState(checkedHallId);

    const changeHall = () =>{
        setShowPopup(false);
        setCheckedHallId(nextCheckedHallId);
        dispatch(changeSelectedHall({name: target, hallId: nextCheckedHallId}));
    }

    const notSaveChanges = (e) => {
        e.preventDefault();
        console.log("notSaveChanges");
        changeHall()
    };

    const toSaveChanges = (e) => {
        e.preventDefault();
        console.log("toSaveChanges");
        changeHall()
    };

    return (
        <>
            <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале "${halls[chairsUpdateHall.id].name}"`}
                     onClose={() => setShowPopup(false)}
                     onReset={e => notSaveChanges(e)}
                     onSubmit={e => toSaveChanges(e)}
                     textForSubmitBtn="Да"
                     textForResetBtn="Нет"/>
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {
                    Object.keys(halls).map((id) =>
                        <li key={id}>
                            <input type="radio" className="conf-step__radio"
                                   name={target}
                                   value={halls[id].name}
                                   checked={id === checkedHallId}
                                   onChange={() => {

                                       if (checkedHall.isUpdated) {
                                           setShowPopup(true);
                                           setNextCheckedHallId(id);
                                       }
                                       else {
                                           setCheckedHallId(id);
                                           dispatch(changeSelectedHall({name: target, hallId: id}));
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