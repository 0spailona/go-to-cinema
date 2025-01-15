import {useState} from "react";
import {useSelector} from "react-redux";

export default function ToSelectHall({selectedHall,onChange}) {


    const {
        halls
    } = useSelector(state => state.halls);

    console.log("selectedHall", selectedHall);

    return (
        <>
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {
                    Object.keys(halls).map((hallId) =>
                        <li key={hallId}>
                            <input type="radio" className="conf-step__radio"
                                   value={halls[hallId].name}
                                   checked={hallId === selectedHall.hallId}
                                   onChange={(e) => onChange(e,hallId)}
                            />
                            <span className="conf-step__selector">{halls[hallId].name}</span>
                        </li>)
                }
            </ul>
        </>
    );
}