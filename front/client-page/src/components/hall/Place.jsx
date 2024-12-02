import {placesType} from "../../js/info.js";

export default function Place({status, onChange}) {
    const onClick = () => {
        if (!onChange) {
            return;
        }

        switch (status) {
            case placesType.standart:
                onChange(placesType.selected);
                break;
            case placesType.vip:
                onChange(placesType.selected);
                break;
        }
    };
    return <span className={`buying-scheme__chair buying-scheme__chair_${status}`} onClick={onClick}></span>;
}