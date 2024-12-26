import MyButton from "./common/myButton.jsx";
import ConfStepHeader from "./common/ConfStepHeader.jsx";
import ToSelectHall from "./toSelectHall.jsx";
import MyInput from "./common/myInput.jsx";
import Place from "./common/place.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {isValid} from "../js/utils.js";
import {placesType} from "../js/info.js";
import {
    fetchHallByName,
    fetchHalls, updatePlacesInHall,
    updatePrice,
    updatePricesInHall
} from "../redux/slices/halls.js";
import MyPopup from "./common/myPopup.jsx";

export default function ToUpdatePrice() {

    const dispatch = useDispatch();
    const {
        halls
    } = useSelector(state => state.halls);

    const [inputValueStandardPrice, setInputValueStandardPrice] = useState(0);
    const [inputValueVipPrice, setInputValueVipPrice] = useState(0);
    const [hallToUpdate, setHallToUpdate] = useState({hallName:null,isUpdated: false});
    const [showPopup, setShowPopup] = useState(false);
    const [nextCheckedHallName, setNextCheckedHallName] = useState(null);

    useEffect(() => {
        //console.log("ToUpdateHall useEffect hall.rowCount",hall.rowCount)
        if (halls && hallToUpdate.hallName === null) {
            const hall = halls[Object.keys(halls)[0]];
            setInputValueStandardPrice(hall.prices.standard);
            setInputValueVipPrice(hall.prices.vip)
            setHallToUpdate({hallName: hall.name, isUpdated: false});
        }
    },[halls])


    const onBlurPrice = (e,type) => {

        const lastData = type === placesType.standard?halls[hallToUpdate.hallName].prices.standard :
            halls[hallToUpdate.hallName].prices.vip;
        const value = +e.target.value.trim();
        if (isValid(value,null,null)) {
            dispatch(updatePrice({
                type,
                price: value,
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
        setInputValueStandardPrice(hall.prices.standard);
        setInputValueVipPrice(hall.prices.vip)
        setHallToUpdate({hallName:newHallToUpdate,isUpdated: false})
    };

    const notToSaveChanges = (e, newHallToUpdate) => {
        e.preventDefault();
        dispatch(fetchHalls());
        changeHall(newHallToUpdate);
    };

    const toSaveChanges = (e, newHallToUpdate) => {
        e.preventDefault();
        dispatch(updatePricesInHall(halls[hallToUpdate.hallName]));
        changeHall(newHallToUpdate);
    };

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация цен"/>
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
                <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0" value={inputValueStandardPrice}
                             onChange={(event) => setInputValueStandardPrice(event.target.value)}
                             onBlur={(e) => onBlurPrice(e,placesType.standard)}/> за <Place status={`${placesType.standard}`}/> обычные кресла
                </div>
                <div className="conf-step__legend">
                    <MyInput label="Цена, рублей" placeholder="0" value={inputValueVipPrice}
                             onChange={(event) => setInputValueVipPrice(event.target.value)}
                             onBlur={e => onBlurPrice(e,placesType.vip)}/> за <Place status={`${placesType.vip}`}/> VIP кресла
                </div>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена" onclick={()=>dispatch(fetchHalls())}/>
                    <MyButton type="submit" text="Сохранить" onclick={()=> {
                        dispatch(updatePricesInHall(halls[hallToUpdate.hallName]))
                        setHallToUpdate({hallName:hallToUpdate.hallName, isUpdated: false});
                    }
                    }/>
                </div>
                    </> :
                    <p className="conf-step__paragraph">Еще нет ни одного зала</p>}
            </div>
        </section>
    );
}