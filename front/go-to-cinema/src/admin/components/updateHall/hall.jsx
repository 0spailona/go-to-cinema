import Place from "../common/place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {placesType} from "../../info.js";

export default function Hall({hallId}) {

    const dispatch = useDispatch();

    const {
        halls,
    } = useSelector(state => state.halls);

    const hall = halls[hallId];
    console.log("hall",hall);
    const rowCount = hall.rowCount
    const placesInRow = hall.placeInRowCount
    //const disabled = hall.custom.disabled.length ? hall.custom.disabled : hall.type.disabled;
    //const vip = hall.custom.vip.length ? hall.custom.vip : hall.type.vip;
    //const rows = [...Array(rowCount).keys()].map((_, i) => i + 1);
    //const places = [...Array(placesInRow).keys()].map((_, i) => i + 1);


    const  onPlaceChange = (row,place,newStatus) =>{
//todo dispatch
    }

    return (
        <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
                {hall.places.map((row,rowIndex) => {
                    return <div className="conf-step__row" key={rowIndex}>{row.map((place,placeIndex) => {
                        return <Place status={place} key={`${rowIndex}-${placeIndex}`}
                                      onChange={newStatus => onPlaceChange(row,place,newStatus)}/>;
                    })}</div>;
                })}
            </div>
        </div>

    );
}