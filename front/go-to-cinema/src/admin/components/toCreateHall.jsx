import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useSelector} from "react-redux";

export default function ToCreateHall() {

    const {
        halls,
        hallsId
    } = useSelector(state => state.halls)

    console.log("ToCreateHall halls",halls)

    const createHall = ()=>{
        console.log("Create Hall");
    }

    return (
        <section className="conf-step">
            <ConfStepHeader title="Управление залами"/>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Доступные залы:</p>
                <ul className="conf-step__list">
                    {Object.keys(halls).map((id) => <li key={id}>{halls[id].name} <button className="conf-step__button conf-step__button-trash"></button>
                    </li>)}
                </ul>
                <MyButton text="Создать зал" type="submit" onclick={()=>createHall()}/>
            </div>
        </section>
    )
}