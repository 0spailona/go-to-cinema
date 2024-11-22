import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useAppSelector} from "../../redux/hooks.js";

export default function ToCreateHall() {

    const {
        halls,
        hallsId
    } = useAppSelector(state => state.halls)

    return (
        <section className="conf-step">
            <ConfStepHeader title="Управление залами"/>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Доступные залы:</p>
                <ul className="conf-step__list">
                    {hallsId.map((id) => <li key={id}>{halls[id].name} <button className="conf-step__button conf-step__button-trash"></button>
                    </li>)}
                </ul>
                <MyButton text="Создать зал" type="submit"/>
            </div>
        </section>
    )
}