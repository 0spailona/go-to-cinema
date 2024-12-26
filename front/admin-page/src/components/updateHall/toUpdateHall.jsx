import ToSelectHall from "../toSelectHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MyInput from "../common/myInput.jsx";
import Place from "../common/place.jsx";
import MyButton from "../common/myButton.jsx";
import {useEffect, useState} from "react";
import {
   fetchHallByName,
    fetchHalls,
    updateCustomPlaces,
    updateCustomRows,
    updatePlacesInHall
} from "../../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {isValid} from "../../js/utils.js";
import {placesType} from "../../js/info.js";
import MyPopup from "../common/myPopup.jsx";

export default function ToUpdateHall() {

    const dispatch = useDispatch();

    const {
        halls,hallConfig,
    } = useSelector(state => state.halls);

    const [inputValueRows, setInputValueRows] = useState(0);
    const [inputValuePlaces, setInputValuePlaces] = useState(0);
    const [hallToUpdate, setHallToUpdate] = useState({hallName:null,isUpdated: false});
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallName, setNextCheckedHallName] = useState(null);


    useEffect(() => {
        if (halls && hallToUpdate.hallName === null) {
            const hall = halls[Object.keys(halls)[0]];
            setInputValueRows(hall.rowCount);
            setInputValuePlaces(hall.placeInRowCount)
            setHallToUpdate({hallName: hall.name, isUpdated: false});
        }
    }, [halls]);


    const onBlurPlacesInput = (e) => {
        const lastData = halls[hallToUpdate.hallName].placeInRowCount;
        const value = +e.target.value.trim();
        if (isValid(value,hallConfig.placesInRow.min,hallConfig.placesInRow.max)) {
            dispatch(updateCustomPlaces({
                places: value,
                hallId: hallToUpdate.hallName
            }));
        }
        if(value !== lastData){
            console.log("value !== lastData",value,lastData)
            setHallToUpdate({hallName:hallToUpdate.hallName, isUpdated: true});
        }
    };

    const onBlurRowsInput = (e) => {
        const lastData = halls[hallToUpdate.hallName].rowCount;
        const value = +e.target.value.trim();
        if (isValid(value,hallConfig.rowsCount.min,hallConfig.rowsCount.max)) {
            dispatch(updateCustomRows({
                rows: value,
                hallId: hallToUpdate.hallName
            }));
        }
        if(value !== lastData){
            console.log("value !== lastData",value,lastData)
            setHallToUpdate({hallName:hallToUpdate.hallName, isUpdated: true});
        }
    };

    const changeHall = (newHallToUpdate) => {
        dispatch(fetchHallByName(newHallToUpdate))
        const hall = halls[newHallToUpdate];
        setInputValueRows(hall.rowCount);
        setInputValuePlaces(hall.placeInRowCount)
        setHallToUpdate({hallName:newHallToUpdate,isUpdated: false})
    };

    const notToSaveChanges = (e, newHallToUpdate) => {
        e.preventDefault();
        dispatch(fetchHalls());
        changeHall(newHallToUpdate);
    };

    const toSaveChanges = (e, newHallToUpdate) => {
        e.preventDefault();
        dispatch(updatePlacesInHall(halls[hallToUpdate.hallName]));
        changeHall(newHallToUpdate);
    };

    //console.log("updateHAll hallToUpdate", hallToUpdate);
    //console.log("halls",halls)

    return (
        <>
            <section className="conf-step">
                <ConfStepHeader title="Конфигурация залов"/>
                <div className="conf-step__wrapper">
                    {halls && hallToUpdate.hallName ? <>
                        <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале "${hallToUpdate.hallName}"`}
                                 onClose={() => setShowPopup(false)}
                                 onReset={e => {
                                     notToSaveChanges(e, nextCheckedHallName);
                                     setShowPopup(false);
                                 }}
                                 onSubmit={e => {
                                     toSaveChanges(e, nextCheckedHallName);
                                     setShowPopup(false);
                                 }}
                                 textForSubmitBtn="Да"
                                 textForResetBtn="Нет"/>
                        <ToSelectHall selectedHall={hallToUpdate}
                                      onChange={(e, hallName) => {
                                          if (hallToUpdate.isUpdated) {
                                              setShowPopup(true);
                                              setNextCheckedHallName(hallName);
                                          }
                                          else {
                                              notToSaveChanges(e, hallName);
                                          }
                                      }
                                      }/>
                        <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в
                            ряду:</p>
                        <div className="conf-step__legend">
                            <MyInput label="Рядов, шт" placeholder={`${inputValueRows}`}
                                     onChange={(e) => setInputValueRows(e.target.value)}
                                     onBlur={(e) => onBlurRowsInput(e)}
                                     value={inputValueRows}/>
                            <span className="multiplier">x</span>
                            <MyInput label="Мест, шт" placeholder={`${inputValuePlaces}`}
                                     onChange={(event) => setInputValuePlaces(event.target.value)}
                                     onBlur={(e) => onBlurPlacesInput(e)}
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
                        <Hall hallName={hallToUpdate.hallName}
                              onUpdate={()=> {
                                  setHallToUpdate({hallName:hallToUpdate.hallName, isUpdated: true});
                              }
                        }/>
                        <div className="conf-step__buttons text-center">
                            <MyButton type="reset" text="Отмена" onclick={()=>dispatch(fetchHalls())}/>
                            <MyButton type="submit" text="Сохранить" onclick={()=> {
                                dispatch(updatePlacesInHall(halls[hallToUpdate.hallName]))
                                setHallToUpdate({hallName:hallToUpdate.hallName, isUpdated: false});
                            }
                            }/>
                        </div>
                    </> :
                        <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
                </div>
            </section>
        </>
    );
}