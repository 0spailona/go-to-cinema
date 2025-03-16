import {useSelector} from "react-redux";

export default function SelectionHall({selectedHall, onChange, history}) {
//console.log("SelectionHall selectedHall",selectedHall, history);

    const {
        halls
    } = useSelector(state => state.halls);

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
                                   onChange={(e) => onChange(e, hallId)}
                            />
                            <span className="conf-step__selector">{halls[hallId].name}</span>
                        </li>)
                }
            </ul>
        </>
    );
}