import MyButton from "./myButton.jsx";
import ConfStepHeader from "./ConfStepHeader.jsx";
import ToSelectHall from "./toSelectHall.jsx";
import MyInput from "./myInput.jsx";
import Place from "./place.jsx";

export  default function ToUpdatePrice(){

    const halls = [{name: "Зал 1", checked: true}, {name: "Зал 2", checked: false}];

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация цен"/>
            <div className="conf-step__wrapper">
                <ToSelectHall halls={halls}/>
                <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0"/> за <Place status="standart"/> обычные кресла
                </div>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0" value="350"/> за <Place status="vip"/> VIP кресла
                </div>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>
    )
}