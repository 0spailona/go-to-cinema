import ToSelectHall from "../toSelectHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MyInput from "../common/myInput.jsx";
import Place from "../common/place.jsx";
import MyButton from "../common/myButton.jsx";
import {useEffect, useState} from "react";
import {updateCustomPlaces, updateCustomRows} from "../../../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {isValid} from "../../utils.js";
import {placesType} from "../../info.js";

export default function ToUpdateHall() {

    const dispatch = useDispatch();

    const {
        halls,
        chairsUpdateHall
    } = useSelector(state => state.halls);

    const hall = halls[chairsUpdateHall];

    const [inputValueRows, setInputValueRows] = useState(hall.rowCount);
    const [inputValuePlaces, setInputValuePlaces] = useState(hall.placeInRowCount);

    useEffect(() => {
       setInputValuePlaces(hall.placeInRowCount);
        setInputValueRows(hall.rowCount);
    },[chairsUpdateHall])

    const onBlurPlaces = (e) => {
        const value = +e.target.value.trim();
        if(isValid(value)) {
            dispatch(updateCustomPlaces({
                places: value,
                hallId: chairsUpdateHall
            }));
        }
    };

    const onBlurRows = (e) => {
        const value = +e.target.value.trim();
        if(isValid(value)) {
            dispatch(updateCustomRows({
                rows: value,
                hallId: chairsUpdateHall
            }));
        }
    };

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация залов"/>
            <div className="conf-step__wrapper">
                <ToSelectHall name="chairs-hall"/>
                <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в
                    ряду:</p>
                <div className="conf-step__legend">
                    <MyInput label="Рядов, шт" placeholder={`${halls[chairsUpdateHall].rowCount}`}
                             onChange={(e) => setInputValueRows(e.target.value)}
                             onBlur={(e) => onBlurRows(e)}
                             value={inputValueRows}/>
                    <span className="multiplier">x</span>
                    <MyInput label="Мест, шт" placeholder={`${halls[chairsUpdateHall].placeInRowCount}`}
                             onChange={(event) => setInputValuePlaces(event.target.value)}
                             onBlur={(e) => onBlurPlaces(e)}
                             value={inputValuePlaces}/>
                </div>
                <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="conf-step__legend">
                    <Place status={`${placesType.standart}`}/> — обычные кресла
                    <Place status={`${placesType.vip}`}/> — VIP кресла
                    <Place status={`${placesType.disabled}`}/> — заблокированные (нет
                    кресла)
                    <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                </div>
                <Hall hallId={chairsUpdateHall}/>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>
    );
}