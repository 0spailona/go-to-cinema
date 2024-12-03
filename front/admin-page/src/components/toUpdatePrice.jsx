import MyButton from "./common/myButton.jsx";
import ConfStepHeader from "./common/ConfStepHeader.jsx";
import ToSelectHall from "./toSelectHall.jsx";
import MyInput from "./common/myInput.jsx";
import Place from "./common/place.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {isValid} from "../js/utils.js";
import {placesType} from "../js/info.js";
import {updatePrice} from "../redux/slices/halls.js";

export default function ToUpdatePrice() {

    const dispatch = useDispatch();
    const {
        halls,pricesUpdateHall
    } = useSelector(state => state.halls);

    const hall = halls[pricesUpdateHall.id];
    const [inputValuestandardPrice, setInputValuestandardPrice] = useState(hall.prices.standard);
    const [inputValueVipPrice, setInputValueVipPrice] = useState( hall.prices.vip);

    useEffect(() => {
        //console.log("ToUpdateHall useEffect hall.rowCount",hall.rowCount)
        setInputValuestandardPrice(hall.prices.standard);
        setInputValueVipPrice(hall.prices.vip);
    },[pricesUpdateHall])


    const onBlurPrice = (e,type) => {
        const value = +e.target.value.trim();
        if (isValid(value)) {
            dispatch(updatePrice({
                type,
                price: value,
                hallId: pricesUpdateHall.id
            }));
        }
    };

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация цен"/>
            <div className="conf-step__wrapper">
                <ToSelectHall name="prices-hall"/>
                <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0" value={inputValuestandardPrice}
                             onChange={(event) => setInputValuestandardPrice(event.target.value)}
                             onBlur={(e) => onBlurPrice(e,placesType.standard)}/> за <Place status={`${placesType.standard}`}/> обычные кресла
                </div>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0" value={inputValueVipPrice}
                             onChange={(event) => setInputValueVipPrice(event.target.value)}
                             onBlur={e => onBlurPrice(e,placesType.vip)}/> за <Place status={`${placesType.vip}`}/> VIP кресла
                </div>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>
    );
}