import {placesType} from "../../js/info.js";
import {useState} from "react";

export default function Place({status, onChange}) {

    const [selectedType, setSelectedType] = useState(null);

    let style;

    //console.log("Place status", status);

    if (onChange && (status === placesType.standard
        || status === placesType.selected
        || status === placesType.vip)) {
        style = {cursor: "pointer"};
    }
    const onClick = () => {
        if (!onChange) {
            return;
        }
        switch (status) {
            case placesType.standard:
                setSelectedType(placesType.standard);
                onChange(placesType.selected, true);
                break;
            case placesType.vip:
                setSelectedType(placesType.vip);
                onChange(placesType.selected, true);
                break;
            case placesType.selected:
                onChange(selectedType, false);
        }
    };
    return <span className={`buying-scheme__chair buying-scheme__chair_${status}`} style={style}
                 onClick={onClick}></span>;
}