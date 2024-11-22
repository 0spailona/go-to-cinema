import MyButton from "./common/myButton.jsx";
import ConfStepHeader from "./common/ConfStepHeader.jsx";
import ToSelectHall from "./toSelectHall.jsx";
import MyInput from "./common/myInput.jsx";
import Place from "./common/place.jsx";

export  default function ToUpdatePrice(){

    //const halls = [{name: "Зал 1", checked: true}, {name: "Зал 2", checked: false}];
const onChangeStandartPrice = (e) => {

}

const onChangeVipPrice = (e) => {

}

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация цен"/>
            <div className="conf-step__wrapper">
                <ToSelectHall name="prices-hall"/>
                <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0"
                             onChangeEvent={(event)=> onChangeStandartPrice(event)}/> за <Place status="standart"/> обычные кресла
                </div>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0" value="350"
                             onChangeEvent={(event)=> onChangeVipPrice(event)}/> за <Place status="vip"/> VIP кресла
                </div>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>
    )
}