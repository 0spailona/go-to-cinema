import MyButton from "./common/myButton.jsx";
import ConfStepHeader from "./common/ConfStepHeader.jsx";
import SelectionHall from "./selectionHall.jsx";
import MyInput from "./common/myInput.jsx";
import Place from "./common/place.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getValidationError} from "../js/utils.js";
import {placesType} from "../js/info.js";
import {setHalls, setLoadingHalls, updateStandardPrice, updateVipPrice} from "../redux/slices/halls.js";
import MyPopup from "./common/myPopup.jsx";
import {getHalls, updatePricesInHall} from "../js/api.js";
import {setError} from "../redux/slices/common.js";


export default function ConfigPrice() {


    const dispatch = useDispatch();
    const {halls, hallConfig} = useSelector(state => state.halls);

    const [inputValueStandardPrice, setInputValueStandardPrice] = useState(0);
    const [inputValueVipPrice, setInputValueVipPrice] = useState(0);
    const [hallToUpdate, setHallToUpdate] = useState({hallId: null, isUpdated: false});
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallId, setNextCheckedHallId] = useState(null);
    const [validateError, setValidateError] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [pricesFromServer, setPricesFromServer] = useState({
        vip: null,
        standard: null
    });

    const setInitialState = (hall, isUpdated) => {
        setPricesFromServer({
            vip: hall.prices.vip,
            standard: hall.prices.standard
        });
        setInputValueStandardPrice(hall.prices.standard);
        setInputValueVipPrice(hall.prices.vip);
        setHallToUpdate({hallId: hall.id, isUpdated});
    };

    useEffect(() => {

        if (!halls || Object.keys(halls).length === 0) {
            return;
        }

        if (!hallToUpdate.hallId) {
            setInitialState(halls[Object.keys(halls)[0]], false);
        }

        else {
            if (!halls[hallToUpdate.hallId]) {
                setInitialState(halls[Object.keys(halls)[0]], false);
            }
            else if(hallToUpdate.isUpdated){
                setInitialState(halls[hallToUpdate.hallId], true);
            }
            else {
                setInitialState(halls[hallToUpdate.hallId], false);
            }
        }

    }, [halls]);

    const getHallsFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
            dispatch(setError("Что-то пошло не так. Попробуйте позже"));
        }
        dispatch(setLoadingHalls(false));
    };

    const onBlurVipPrice = (e) => {
        const value = +e.target.value.trim();
        const error = getValidationError(value, hallConfig.minVipPrice, hallConfig.maxPrice);

        if (error) {
            setValidateError(`Ошибка в цене vip. ${error}`);
            setShowErrorPopup(true);
        }
        else {
            if (value !== pricesFromServer.vip) {
                setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
            }
            dispatch(updateVipPrice({
                price: value,
                hallId: hallToUpdate.hallId
            }));

        }
    };

    const onBlurStandardPrice = (e) => {

        const value = +e.target.value.trim();
        const error = getValidationError(value, hallConfig.minStandardPrice, hallConfig.maxPrice);

        if (error) {
            setValidateError(`Ошибка в цене обычного билета. ${error}`);
            setShowErrorPopup(true);
        }
        else {

            if (value !== pricesFromServer.standard) {
                setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
            }

            dispatch(updateStandardPrice({
                price: value,
                hallId: hallToUpdate.hallId
            }));

        }
    };

    const updatePricesOnServer = async () => {
        dispatch(setLoadingHalls(true));

        const response = await updatePricesInHall(halls[hallToUpdate.hallId]);

        if (response.status !== "success") {
            const message = response.message ? response.message : "Что-то пошло не так. Попробуйте позже";
            dispatch(setError(message));
        }

        dispatch(setLoadingHalls(false));
    };

    const changeHall = (newHallToUpdate) => {
        setInitialState(halls[newHallToUpdate], false);
    };

    const notToSaveChanges = async (e, newHallToUpdate) => {
        e.preventDefault();
        await getHallsFromServer();
        changeHall(newHallToUpdate);
    };


    const toSaveChanges = async (e, newHallToUpdate) => {
        e.preventDefault();
        await updatePricesOnServer();
        await getHallsFromServer();
        changeHall(newHallToUpdate);
    };

    const toSaveByButton = async () => {
        const errorVip = getValidationError(inputValueVipPrice, hallConfig.minVipPrice, hallConfig.maxPrice);
        const errorStandard = getValidationError(inputValueStandardPrice, hallConfig.minStandardPrice, hallConfig.maxPrice);
        if (errorVip || errorStandard) {
            const vipMsg = errorVip ? `Ошибка в цене vip. ${errorVip}` : "";
            const standardMsg = errorStandard ? `Ошибка в цене обычного билета. ${errorStandard}` : "";
            setValidateError(`${errorVip ? vipMsg : ""} ${errorStandard ? standardMsg : ""}`);
            setShowErrorPopup(true);
        }
        else {
            await updatePricesOnServer();
            setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: false});
            setValidateError(null);
        }
    };

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация цен"/>
            <div className="conf-step__wrapper">
                {halls && hallToUpdate.hallId ? <>
                        <MyPopup isVisible={showErrorPopup} title="Неверно введенные данные"
                                 onClose={() => {
                                     setShowErrorPopup(false);
                                     setValidateError(null);
                                 }}>
                            <p className="conf-step__paragraph">{`${validateError}`}</p>
                        </MyPopup>
                        <MyPopup isVisible={showPopup}
                                 title={`Сохранить изменения в зале "${halls[hallToUpdate.hallId]?.name}"`}
                                 onClose={() => setShowPopup(false)}
                                 onReset={async e => {
                                     await notToSaveChanges(e, nextCheckedHallId);
                                     setShowPopup(false);
                                 }}
                                 onSubmit={async e => {
                                     await toSaveChanges(e, nextCheckedHallId);
                                     setShowPopup(false);
                                 }}
                                 textForSubmitBtn="Да"
                                 textForResetBtn="Нет"/>
                        <SelectionHall selectedHall={hallToUpdate}
                                       onChange={async (e, hallId) => {
                                           if (hallToUpdate.isUpdated) {
                                               setShowPopup(true);
                                               setNextCheckedHallId(hallId);
                                           }
                                           else {
                                               await notToSaveChanges(e, hallId);
                                           }
                                       }
                                       }/>
                        <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
                        <div className="conf-step__legend">
                            <MyInput label="Цена, рублей" placeholder="0" value={inputValueStandardPrice}
                                     onChange={(event) => setInputValueStandardPrice(event.target.value)}
                                     onBlur={e => onBlurStandardPrice(e)}/> за <Place
                            status={`${placesType.standard}`}/> обычные кресла
                        </div>
                        <div className="conf-step__legend">
                            <MyInput label="Цена, рублей" placeholder="0" value={inputValueVipPrice}
                                     onChange={(event) => setInputValueVipPrice(event.target.value)}
                                     onBlur={e => onBlurVipPrice(e)}/> за <Place status={`${placesType.vip}`}/> VIP кресла
                        </div>
                        <div className="conf-step__buttons text-center">
                            <MyButton type="reset" text="Отмена" onclick={async () => {
                                setInitialState(halls[hallToUpdate.hallId],false);
                                await getHallsFromServer();
                            }}/>
                            <MyButton type="submit" text="Сохранить" onclick={toSaveByButton}/>
                        </div>
                    </> :
                    <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
            </div>
        </section>
    );
}