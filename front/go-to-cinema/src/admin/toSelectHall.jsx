// eslint-disable-next-line react/prop-types
export default function ToSelectHall({halls}){

    return (
        <><p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul className="conf-step__selectors-box">
                {/* eslint-disable-next-line react/prop-types */}
                {halls.map(hall => <li key={hall.name}><input type="radio" className="conf-step__radio" name="chairs-hall" value={hall.name}
                                              checked={hall.checked}/><span
                    className="conf-step__selector">{hall.name}</span></li>)}
            </ul>
        </>
    )
}