import {useState} from "react";
//import {useAppDispatch, useAppSelector} from "../../redux/hooks.js";
import {changeSelectedHall} from "../../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../redux/store.js";

export default function ToSelectHall({name}) {

    const dispatch = useDispatch();

    const {
        halls,
        hallsId
    } = useSelector(state => state.halls)

    const [checkedHallId, setCheckedHallId] = useState(hallsId[0]);


    console.log("render", halls);
    return (
        <>
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {
                    hallsId.map((id) =>
                        <li key={id}>
                            <input type="radio" className="conf-step__radio"
                                   name={name}
                                   value={halls[id].name}
                                   checked={id === checkedHallId}
                                   onChange={() => {
                                       setCheckedHallId(id)
                                       dispatch(changeSelectedHall({name:name,hallId:id}));
                                   }}
                            />
                            <span className="conf-step__selector">{halls[id].name}</span>
                        </li>)
                }
            </ul>
        </>
    );
}