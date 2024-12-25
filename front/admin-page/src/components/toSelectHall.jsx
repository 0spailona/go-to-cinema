import {useState} from "react";
import {useSelector} from "react-redux";

export default function ToSelectHall({selectedHall,onChange}) {


    const {
        halls
    } = useSelector(state => state.halls);

    const [nextCheckedHallName, setNextCheckedHallName] = useState(null);

    return (
        <>
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {
                    Object.keys(halls).map((hallName) =>
                        <li key={hallName}>
                            <input type="radio" className="conf-step__radio"
                                   value={halls[hallName].name}
                                   checked={hallName === selectedHall.hallName}
                                   onChange={(e) => onChange(e,hallName)}
                            />
                            <span className="conf-step__selector">{hallName}</span>
                        </li>)
                }
            </ul>
        </>
    );
}