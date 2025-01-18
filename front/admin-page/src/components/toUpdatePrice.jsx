import MyButton from "./common/myButton.jsx";
import ConfStepHeader from "./common/ConfStepHeader.jsx";
import ToSelectHall from "./toSelectHall.jsx";
import MyInput from "./common/myInput.jsx";
import Place from "./common/place.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getValidationError} from "../js/utils.js";
import {placesType} from "../js/info.js";
import {
    //fetchHallById,
    setHalls, setLoadingHalls,
    //fetchHalls,
    //updatePricesInHall,
    updateStandardPrice,
    updateVipPrice
} from "../redux/slices/halls.js";
import MyPopup from "./common/myPopup.jsx";
import {getHalls, updatePricesInHall} from "../js/api.js";

export default function ToUpdatePrice() {

    const dispatch = useDispatch();
    const {
        halls, hallConfig
    } = useSelector(state => state.halls);

    //console.log(hallConfig);

    const pricesFromServer = {
        vip: null,
        standard: null,
    };


    const [inputValueStandardPrice, setInputValueStandardPrice] = useState(0);
    const [inputValueVipPrice, setInputValueVipPrice] = useState(0);
    const [hallToUpdate, setHallToUpdate] = useState({hallId: null, isUpdated: false});
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallId, setNextCheckedHallId] = useState(null);
    const [validateError, setValidateError] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    const setInitialState = (hall) => {
        setInputValueStandardPrice(hall.prices.standard);
        setInputValueVipPrice(hall.prices.vip);
        setHallToUpdate({hallId: hall.id, isUpdated: false});
        pricesFromServer.vip = hall.prices.vip;
        pricesFromServer.standard = hall.prices.standard;
    };

    useEffect(() => {
       //console.log("ToUpdatePrice  useEffect by halls halls",halls)
        //console.log("useEffect by halls Object.keys(halls).length",Object.keys(halls).length)
        //console.log("useEffect by halls hallToUpdate.id",hallToUpdate.hallId)
        //console.log("ToUpdateHall useEffect hall.rowCount",hall.rowCount)
        if (halls && Object.keys(halls).length > 0 && hallToUpdate.hallId === null) {
            setInitialState(halls[Object.keys(halls)[0]]);
        }
        if (halls && Object.keys(halls).length > 0 && hallToUpdate.hallId !== null && !halls[hallToUpdate.hallId]) {
            setInitialState(halls[Object.keys(halls)[0]]);
        }
    }, [halls]);

    const getHallsFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
            //TODO ERROR
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
            dispatch(updateVipPrice({
                price: value,
                hallId: hallToUpdate.hallId
            }));
            setValidateError(null);

            if (value !== pricesFromServer.vip) {
                setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
            }
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
            dispatch(updateStandardPrice({
                price: value,
                hallId: hallToUpdate.hallId
            }));
            setValidateError(null);
        }
        if (value !== pricesFromServer.standard) {
            setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: true});
        }
    };

    const updatePricesOnServer = async ()=>{
        dispatch(setLoadingHalls(true));

        const response = await updatePricesInHall(halls[hallToUpdate.hallId])

        if(response.status !== "success") {
            //TODO ERROR
        }

        dispatch(setLoadingHalls(false));
    }

    const changeHall = (newHallToUpdate) => {
       // dispatch(fetchHallById(newHallToUpdate));
        setInitialState(halls[newHallToUpdate]);
    };

    const notToSaveChanges = async (e, newHallToUpdate) => {
        e.preventDefault();
        await getHallsFromServer()
       // dispatch(fetchHalls());
        changeHall(newHallToUpdate);
    };


    const toSaveChanges = async (e, newHallToUpdate) => {
        e.preventDefault();

        await updatePricesOnServer()
       // dispatch(updatePricesInHall(halls[hallToUpdate.hallId]));
        await getHallsFromServer()
        //dispatch(fetchHalls());
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
            await updatePricesOnServer()
            //dispatch(updatePricesInHall(halls[hallToUpdate.hallId]));
            setHallToUpdate({hallId: hallToUpdate.hallId, isUpdated: false});
            setValidateError(null);
        }
    };

    //console.log("ToUpdatePrice halls", halls);
    //console.log("ToUpdatePrice hallToUpdate.hallId", hallToUpdate.hallId);

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация цен"/>
            <div className="conf-step__wrapper">
                {halls && hallToUpdate.hallId ? <>
                        <MyPopup isVisible={showErrorPopup} title="Неверно введенные данные"
                                 onClose={() => setShowErrorPopup(false)}>
                            <p className="conf-step__paragraph">{`${validateError}`}</p>
                        </MyPopup>
                        <MyPopup isVisible={showPopup} title={`Сохранить изменения в зале "${halls[hallToUpdate.hallId]?.name}"`}
                                 onClose={() => setShowPopup(false)}
                                 onReset={e => {
                                     notToSaveChanges(e, nextCheckedHallId);
                                     setShowPopup(false);
                                 }}
                                 onSubmit={e => {
                                     toSaveChanges(e, nextCheckedHallId);
                                     setShowPopup(false);
                                 }}
                                 textForSubmitBtn="Да"
                                 textForResetBtn="Нет"/>
                        <ToSelectHall selectedHall={hallToUpdate}
                                      onChange={(e, hallId) => {
                                          if (hallToUpdate.isUpdated) {
                                              setShowPopup(true);
                                              setNextCheckedHallId(hallId);
                                          }
                                          else {
                                              notToSaveChanges(e, hallId);
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
                                await getHallsFromServer()
                                // dispatch(fetchHalls());
                            }}/>
                            <MyButton type="submit" text="Сохранить" onclick={toSaveByButton}/>
                        </div>
                    </> :
                    <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
            </div>
        </section>
    );
}