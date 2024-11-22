import {placesType} from "../../info.js";

export default function Place({status, onChange}) {
    const onClick = () => {
        if (!onChange) {
            return;
        }
        switch (status) {
            case placesType.standart:
                onChange(placesType.vip);
                break;
            case placesType.vip:
                onChange(placesType.disabled);
                break;
            case placesType.disabled:
                onChange(placesType.standart);
                break;
        }
    };
    return <span className={`conf-step__chair conf-step__chair_${status}`} onClick={onClick}></span>;
}