import ToSelectHall from "../toSelectHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MyInput from "../common/myInput.jsx";
import Place from "../common/place.jsx";
import MyButton from "../common/myButton.jsx";
import {useEffect, useState} from "react";
import {
    fetchHallById,
    fetchHalls,
    updateCustomPlaces,
    updateCustomRows,
    updatePlacesInHall
} from "../../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {getValidationError} from "../../js/utils.js";
import {placesType} from "../../js/info.js";
import MyPopup from "../common/myPopup.jsx";

export default function ToUpdateHall() {

    const dispatch = useDispatch();

    const {
        halls, hallConfig,
    } = useSelector(state => state.halls);

    const [inputValueRows, setInputValueRows] = useState(0);
    const [inputValuePlaces, setInputValuePlaces] = useState(0);
    const [hallToUpdate, setHallToUpdate] = useState({hallId: null, isUpdated: false});
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallName, setNextCheckedHallName] = useState(null);
    const [validateError, setValidateError] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    const setInitialState = (hall) => {
        //console.log("set initial state hall",hall);
        setInputValueRows(hall.rowCount);
        setInputValuePlaces(hall.placeInRowCount);
        setHallToUpdate({hallId: hall.id, isUpdated: false});
    };

    useEffect(() => {
        //console.log("useEffect by halls",halls)
        if((!halls || Object.keys(halls).length === 0) && hallToUpdate.hallId !== null) {
            setHallToUpdate({hallId: null, isUpdated: false});
        }

        else if ((halls && Object.keys(halls).length !== 0 && hallToUpdate.hallId === null)
        ||(hallToUpdate.hallId !== null && !Object.keys(halls).includes(hallToUpdate.hallId))) {
            //console.log("set initial state")
            setInitialState(halls[Object.keys(halls)[0]]);
        }
    }, [halls]);


    const onBlurPlacesInput = (e) => {
        const lastData = halls[hallToUpdate.hallId].placeInRowCount;
        const value = +e.target.value.trim();
        const error = getValidationError(value, hallConfig.placesInRow.min, hallConfig.placesInRow.max);
        if (error) {
            setValidateError(`Ошибка в количестве мест. ${error}`);
            setShowErrorPopup(true);
        }
        else {
            dispatch(updateCustomPlaces({
                places: value,
                hallId: hallToUpdate.hallId
            }));
            setValidateError(null);

            if (value !== lastData) {
                setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
            }
        }
    };

    const onBlurRowsInput = (e) => {
        const lastData = halls[hallToUpdate.hallId].rowCount;
        const value = +e.target.value.trim();
        const error = getValidationError(value, hallConfig.rowsCount.min, hallConfig.rowsCount.max);
        if (error) {
            setValidateError(`Ошибка в количестве рядов. ${error}`);
            setShowErrorPopup(true);
        }
        else {
            dispatch(updateCustomRows({
                rows: value,
                hallId: hallToUpdate.hallId
            }));

            setValidateError(null);

            if (value !== lastData) {
                setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
            }
        }
    };

    const changeHall = (newHallToUpdate) => {
        //dispatch(fetchHallById(newHallToUpdate));
        setInitialState(halls[newHallToUpdate]);
    };

    const notToSaveChanges = (e, newHallToUpdate) => {
        e.preventDefault();
        dispatch(fetchHalls());
        changeHall(newHallToUpdate);
    };

    const toSaveChanges = (e, newHallToUpdate) => {
        e.preventDefault();
        dispatch(updatePlacesInHall(halls[hallToUpdate.hallId]));
        dispatch(fetchHalls());
        changeHall(newHallToUpdate);
    };

    const toSaveByButton = () => {
        const errorRow = getValidationError(inputValueRows, hallConfig.rowsCount.min, hallConfig.rowsCount.max);
        const errorPlacesInRow = getValidationError(inputValuePlaces, hallConfig.placesInRow.min, hallConfig.placesInRow.max);
        if (errorRow || errorPlacesInRow) {
            const rowErrorMsg = errorRow ? `Ошибка в количестве рядов. ${errorRow}` : "";
            const placesCountErrorMsg = errorPlacesInRow ? `Ошибка в количестве мест. ${errorPlacesInRow}` : "";
            setValidateError(`${errorRow ? rowErrorMsg : ""} ${errorPlacesInRow ? placesCountErrorMsg : ""}`);
            setShowErrorPopup(true);
        }
        else {
            dispatch(updatePlacesInHall(halls[hallToUpdate.hallId]));
            setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: false});
            setValidateError(null);
        }
    };
    //console.log("updateHAll hallToUpdate", hallToUpdate);
    //console.log("halls",halls)

    return (
        <>
            <section className="conf-step">
                <ConfStepHeader title="Конфигурация залов"/>
                <div className="conf-step__wrapper">
                    {halls && hallToUpdate.hallId ? <>
                            <MyPopup isVisible={showErrorPopup} title="Неверно введенные данные"
                                     onClose={() => setShowErrorPopup(false)}>
                                <p className="conf-step__paragraph">{`${validateError}`}</p>
                            </MyPopup>
                            <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале "${halls[hallToUpdate.hallId].name}"`}
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
                                          onChange={(e, hallId) => {
                                              if (hallToUpdate.isUpdated) {
                                                  setShowPopup(true);
                                                  setNextCheckedHallName(hallId);
                                              }
                                              else {
                                                  notToSaveChanges(e, hallId);
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
                            <Hall hallId={hallToUpdate.hallId}
                                  onUpdate={() => {
                                      setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
                                  }
                                  }/>
                            <div className="conf-step__buttons text-center">
                                <MyButton type="reset" text="Отмена" onclick={() => dispatch(fetchHalls())}/>
                                <MyButton type="submit" text="Сохранить" onclick={toSaveByButton}/>
                            </div>
                        </> :
                        <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
                </div>
            </section>
        </>
    );
}