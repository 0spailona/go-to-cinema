import ToSelectHall from "../toSelectHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MyInput from "../common/myInput.jsx";
import Place from "../common/place.jsx";
import MyButton from "../common/myButton.jsx";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks.js";
import {useState} from "react";
import {updateCustomRows} from "../../../redux/slices/halls.js";

export default function ToUpdateHall() {

    const dispatch = useAppDispatch();

    const {
        halls,
        hallsId, chairsUpdateHall
    } = useAppSelector(state => state.halls);

    const [inputValueRows, setInputValueRows] = useState("");
    const [inputValuePlaces, setInputValuePlaces] = useState("");


    const onChangeRows = (event) => {
        console.log("onChangeRows", event.target.value);
    };

    const onBlurRows = (event) => {
    };

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация залов"/>
            <div className="conf-step__wrapper">
                <ToSelectHall name="chairs-hall"/>
                <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в
                    ряду:</p>
                <div className="conf-step__legend">
                    <MyInput label="Рядов, шт" placeholder={`${halls[chairsUpdateHall].type.rows}`}
                             onChange={(e) => setInputValueRows(e.target.value)}
                             onBlur={(e) => dispatch(updateCustomRows({
                                     rows: e.target.value,
                                     hallId: chairsUpdateHall
                                 })
                             )}
                             value={inputValueRows}/>
                    <span className="multiplier">x</span>
                    <MyInput label="Мест, шт" placeholder={`${halls[chairsUpdateHall].type.placesInRow}`}
                             onChange={(event) => setInputValuePlaces(event.target.value)}
                             onBlur={(e) => setInputValueRows(e.target.value)}
                             value={inputValuePlaces}/>
                </div>
                <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="conf-step__legend">
                    <Place status="standart"/> — обычные кресла
                    <Place status="vip"/> — VIP кресла
                    <Place status="disabled"/> — заблокированные (нет
                    кресла)
                    <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                </div>
                <Hall rowCount={10} placesInRow={8}

                      hallId={chairsUpdateHall}/>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>
    );
}