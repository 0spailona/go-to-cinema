import ConfStepHeader from "./ConfStepHeader.jsx";
import MyButton from "./myButton.jsx";

export default function ToCreateHall() {
    const halls = ["Зал 1","Зал 2"];
    return (
        <section className="conf-step">
            <ConfStepHeader title="Управление залами"/>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Доступные залы:</p>
                <ul className="conf-step__list">
                    {halls.map((hall, index) => <li key={index}>Зал 1 <button className="conf-step__button conf-step__button-trash"></button>
                    </li>)}
                </ul>
                <MyButton text="Создать зал" type="submit"/>
            </div>
        </section>
    )
}