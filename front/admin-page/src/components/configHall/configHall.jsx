import SelectionHall from "../selectionHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MyInput from "../common/myInput.jsx";
import Place from "../common/place.jsx";
import MyButton from "../common/myButton.jsx";
import {useEffect, useState} from "react";
import {
    setHalls, setHallToUpdateConfig, setLoadingHalls,
    updateCustomPlaces,
    updateCustomRows,
} from "../../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {getValidationError} from "../../js/utils.js";
import {placesType} from "../../js/info.js";
import MyPopup from "../common/myPopup.jsx";
import {getHalls, updatePlacesInHall} from "../../js/api.js";
import {setError} from "../../redux/slices/common.js";

export default function ConfigHall() {

    const dispatch = useDispatch();

    const {
        halls, hallConfig,hallToUpdateConfig
    } = useSelector(state => state.halls);

    const [inputValueRows, setInputValueRows] = useState(0);
    const [inputValuePlaces, setInputValuePlaces] = useState(0);
    const [hallToUpdate, setHallToUpdate] = useState({hallId: null, isUpdated: false});
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallName, setNextCheckedHallName] = useState(null);

    const setInitialState = (hall) => {
        setInputValueRows(hall.rowsCount);
        setInputValuePlaces(hall.placesInRow);
        setHallToUpdate({hallId: hall.id, isUpdated: false});
    };


    useEffect(() => {
        if((!halls || Object.keys(halls).length === 0) && hallToUpdate.hallId !== null) {
            setHallToUpdate({hallId: null, isUpdated: false});
        }

        else if ((halls && Object.keys(halls).length !== 0 && hallToUpdate.hallId === null)
        ||(hallToUpdate.hallId !== null && !Object.keys(halls).includes(hallToUpdate.hallId))) {
            setInitialState(halls[Object.keys(halls)[0]]);
        }
    }, [halls]);

    useEffect(()=>{
        setHallToUpdate(hallToUpdateConfig)
    },[hallToUpdateConfig])


    const getHallsFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
           dispatch(setError("Что-то пошло не так. Попробуйте позже"))
        }
        dispatch(setLoadingHalls(false));
    };

    const onBlurPlacesInput = (e) => {
        const lastData = halls[hallToUpdate.hallId].placesInRow;

        const value = +e.target.value.trim();
        const error = getValidationError(value, hallConfig.placesInRow.min, hallConfig.placesInRow.max);
        if (error) {
            dispatch(setError(`Ошибка в количестве мест. ${error}`));
        }
        else {
            dispatch(updateCustomPlaces({
                places: value,
                hallId: hallToUpdate.hallId
            }));

            if (value !== lastData) {
                dispatch(setHallToUpdateConfig({hallId: hallToUpdate.hallId, isUpdated: true}))
            }
        }
    };

    const onBlurRowsInput = (e) => {
        const lastData = halls[hallToUpdate.hallId].rowsCount;
        const value = +e.target.value.trim();
        const error = getValidationError(value, hallConfig.rowsCount.min, hallConfig.rowsCount.max);
        if (error) {
            dispatch(setError(`Ошибка в количестве рядов. ${error}`))
        }
        else {
            dispatch(updateCustomRows({
                rows: value,
                hallId: hallToUpdate.hallId
            }));

            if (value !== lastData) {
                dispatch(setHallToUpdateConfig({hallId: hallToUpdate.hallId, isUpdated: true}))
            }
        }
    };

    const changeHall = (newHallToUpdate) => {
        setInitialState(halls[newHallToUpdate]);
    };

    const notToSaveChanges = async (e, newHallToUpdate) => {
        e.preventDefault();
        await getHallsFromServer()
        changeHall(newHallToUpdate);
    };

    const updatePlacesInHallOnServer = async ()=>{
        setLoadingHalls(true);

        const response = await updatePlacesInHall(halls[hallToUpdate.hallId])

        if(response.status !== "success") {
            dispatch(setError("Что-то пошло не так. Попробуйте позже"))
        }
        setLoadingHalls(false);
    }

    const toSaveChanges = async (e, newHallToUpdate) => {
        e.preventDefault();

        await updatePlacesInHallOnServer()
        await getHallsFromServer()
        changeHall(newHallToUpdate);
    };

    const toSaveByButton = async () => {
        const errorRow = getValidationError(inputValueRows, hallConfig.rowsCount.min, hallConfig.rowsCount.max);
        const errorPlacesInRow = getValidationError(inputValuePlaces, hallConfig.placesInRow.min, hallConfig.placesInRow.max);
        if (errorRow || errorPlacesInRow) {
            const rowErrorMsg = errorRow ? `Ошибка в количестве рядов. ${errorRow}` : "";
            const placesCountErrorMsg = errorPlacesInRow ? `Ошибка в количестве мест. ${errorPlacesInRow}` : "";
            const errorMsg = `${errorRow ? rowErrorMsg : ""} ${errorPlacesInRow ? placesCountErrorMsg : ""}`
            dispatch(setError(errorMsg))
        }
        else {
            await updatePlacesInHallOnServer()
            dispatch(setHallToUpdateConfig({hallId: hallToUpdate.hallId, isUpdated: false}));
        }
    };

    return (
        <>
            <section className="conf-step">
                <ConfStepHeader title="Конфигурация залов"/>
                <div className="conf-step__wrapper">
                    {halls && hallToUpdate.hallId ? <>
                            <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале "${halls[hallToUpdate.hallId]?.name}"`}
                                     onClose={() => setShowPopup(false)}
                                     onReset={async e => {
                                        await notToSaveChanges(e, nextCheckedHallName)
                                         setShowPopup(false)
                                     }}
                                     onSubmit={async e => {
                                        await toSaveChanges(e, nextCheckedHallName)
                                         setShowPopup(false)
                                     }}
                                     textForSubmitBtn="Да"
                                     textForResetBtn="Нет"/>
                            <SelectionHall selectedHall={hallToUpdate}
                                           onChange={async (e, hallId) => {
                                              if (hallToUpdate.isUpdated) {
                                                  setShowPopup(true);
                                                  setNextCheckedHallName(hallId);
                                              }
                                              else {
                                                await notToSaveChanges(e, hallId);
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
                                <MyButton type="reset" text="Отмена" onclick={async () => {
                                    await getHallsFromServer()
                                }}/>
                                <MyButton type="submit" text="Сохранить" onclick={toSaveByButton}/>
                            </div>
                        </> :
                        <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
                </div>
            </section>
        </>
    );
}