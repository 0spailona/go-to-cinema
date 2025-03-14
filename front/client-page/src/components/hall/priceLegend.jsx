import Place from "./Place.jsx";
import {placesType} from "../../js/info.js";

export default function PriceLegend({status,prices}) {

    if(!prices){
        return null;
    }

    let price;
    let text;

    switch (status) {
        case placesType.standard:
            text = "Свободно";
            price = <>(<span className="buying-scheme__legend-value">{prices.standard}</span>руб)</>;
            break;
        case placesType.vip:
            text = "Свободно VIP";
            price = <>(<span className="buying-scheme__legend-value">{prices.vip}</span>руб)</>;
            break;
        case placesType.taken:
            text = "Занято";
            price = "";
            break;
        case placesType.selected:
            text = "Выбрано";
            price = "";
            break;
    }

    return (
        <p className="buying-scheme__legend-price">
            <Place status={status}/>
            {"\u00A0"}{text}{"\u00A0"}
            {price}
        </p>
    );
}