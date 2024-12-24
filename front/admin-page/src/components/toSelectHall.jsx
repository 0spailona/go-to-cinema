import {useState} from "react";
import {changeSelectedHall, fetchHalls, updatePlacesInHall} from "../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import MyPopup from "./common/myPopup.jsx";
import {selectedHallType} from "../js/info.js";


export default function ToSelectHall({target}) {

    const dispatch = useDispatch();

    const {
        halls, chairsUpdateHall, pricesUpdateHall
    } = useSelector(state => state.halls);

    const checkedHall = target === selectedHallType.chairs ? chairsUpdateHall : pricesUpdateHall;

    const [checkedHallName, setCheckedHallName] = useState(checkedHall.name);
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallName, setNextCheckedHallName] = useState(checkedHallName);

    const changeHall = () =>{
        setShowPopup(false);
        setCheckedHallName(nextCheckedHallName);
        dispatch(fetchHalls())
        dispatch(changeSelectedHall({target, hallName: nextCheckedHallName}));
    }

    const notSaveChanges = (e) => {
        e.preventDefault();
        dispatch(fetchHalls())
        //console.log("notSaveChanges");
        changeHall()
    };

    const toSaveChanges = (e) => {
        e.preventDefault();
        //const places = getPlacesObj(halls[checkedHallName].places);
        dispatch(updatePlacesInHall(halls[checkedHallName]))
        console.log("toSaveChanges");
        changeHall()
    };

    return (
        <>
            <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале "${checkedHallName}"`}
                     onClose={() => setShowPopup(false)}
                     onReset={e => notSaveChanges(e)}
                     onSubmit={e => toSaveChanges(e)}
                     textForSubmitBtn="Да"
                     textForResetBtn="Нет"/>
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {
                    Object.keys(halls).map((hallName) =>
                        <li key={hallName}>
                            <input type="radio" className="conf-step__radio"
                                   name={target}
                                   value={halls[hallName].name}
                                   checked={hallName === checkedHallName}
                                   onChange={() => {

                                       if (checkedHall.isUpdated) {
                                           setShowPopup(true);
                                           setNextCheckedHallName(hallName);
                                       }
                                       else {
                                           setCheckedHallName(hallName);
                                           dispatch(changeSelectedHall({name: target, hallId: hallName}));
                                       }
                                   }}
                            />
                            <span className="conf-step__selector">{hallName}</span>
                        </li>)
                }
            </ul>
        </>
    );
}