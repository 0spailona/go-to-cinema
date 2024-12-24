import ToSelectHall from "../toSelectHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MyInput from "../common/myInput.jsx";
import Place from "../common/place.jsx";
import MyButton from "../common/myButton.jsx";
import {useEffect, useState} from "react";
import {changeSelectedHall, updateCustomPlaces, updateCustomRows} from "../../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {isValid} from "../../js/utils.js";
import {placesType, selectedHallType} from "../../js/info.js";

export default function ToUpdateHall() {

    const dispatch = useDispatch();

    const {
        halls,
        chairsUpdateHall
    } = useSelector(state => state.halls);

    console.log("ToUpdateHall halls", halls);
    let hall = null;
    let rows = 0;
    let placesInRow = 0;


    if(halls && chairsUpdateHall){
        console.log("halls && chairsUpdateHall");
        hall = halls[chairsUpdateHall.name];
        rows = hall.rowCount;
        placesInRow = hall.placeInRowCount
        console.log("hallToUpdate",hall);
        console.log("halls",halls);

        console.log("chairsUpdateHall name",chairsUpdateHall?.name);
    }


    const [inputValueRows, setInputValueRows] = useState(rows);
    const [inputValuePlaces, setInputValuePlaces] = useState(placesInRow);
    const [hallToUpdate, setHallToUpdate] = useState(hall);


    //console.log("hallToUpdate",halls[`${chairsUpdateHall.name}`]);
    useEffect(() => {
        console.log("ToUpdateHall useEffect chairsUpdateHall",chairsUpdateHall);
        if(chairsUpdateHall){
            hall = halls[chairsUpdateHall.name];
            console.log("ToUpdateHall useEffect hall",hall);
            setHallToUpdate(halls[chairsUpdateHall.name])
        }
    }, [chairsUpdateHall]);


    const onBlurPlaces = (e) => {
        const value = +e.target.value.trim();
        if (isValid(value)) {
            dispatch(updateCustomPlaces({
                places: value,
                hallId: chairsUpdateHall.name
            }));
        }
    };

    const onBlurRows = (e) => {
        const value = +e.target.value.trim();
        if (isValid(value)) {
            dispatch(updateCustomRows({
                rows: value,
                hallId: chairsUpdateHall.name
            }));
        }
    };

    return (
        <>
            <section className="conf-step">
                <ConfStepHeader title="Конфигурация залов"/>
                <div className="conf-step__wrapper">
                    {halls && hallToUpdate ? <><ToSelectHall target={selectedHallType.chairs}/>
                        <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в
                            ряду:</p>
                        <div className="conf-step__legend">
                            <MyInput label="Рядов, шт" placeholder={`${inputValueRows}`}
                                     onChange={(e) => setInputValueRows(e.target.value)}
                                     onBlur={(e) => onBlurRows(e)}
                                     value={inputValueRows}/>
                            <span className="multiplier">x</span>
                            <MyInput label="Мест, шт" placeholder={`${inputValuePlaces}`}
                                     onChange={(event) => setInputValuePlaces(event.target.value)}
                                     onBlur={(e) => onBlurPlaces(e)}
                                     value={inputValuePlaces}/>
                        </div>
                        <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                        <div className="conf-step__legend">
                            <Place status={`${placesType.standard}`}/> — обычные кресла
                            <Place status={`${placesType.vip}`}/> — VIP кресла
                            <Place status={`${placesType.disabled}`}/> — заблокированные (нет
                            кресла)
                            <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой
                                мыши</p>
                        </div>
                        <Hall hall={hallToUpdate}/>
                        <div className="conf-step__buttons text-center">
                            <MyButton type="reset" text="Отмена"/>
                            <MyButton type="submit" text="Сохранить"/>
                        </div>
                    </> : ""}
                </div>
            </section>
        </>
    );
}