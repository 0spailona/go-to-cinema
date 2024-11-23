import Place from "../common/place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {changePlaceStatus} from "../../../redux/slices/halls.js";

export default function Hall({hallId}) {

    const dispatch = useDispatch();

    const {
        halls,
    } = useSelector(state => state.halls);

    const hall = halls[hallId];
    console.log("hall", hall);

    const onPlaceChange = (rowIndex, placeIndex, newStatus) => {
        console.log("onPlaceChange", rowIndex, placeIndex, newStatus);
        dispatch(changePlaceStatus({hallId, rowIndex, placeIndex, newStatus}));
    };

    return (
        <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
                {hall.places.map((row, rowIndex) => {
                    return <div className="conf-step__row" key={rowIndex}>{row.map((place, placeIndex) => {
                        return <Place status={place} key={`${rowIndex}-${placeIndex}`}
                                      onChange={newStatus => onPlaceChange(rowIndex, placeIndex, newStatus)}/>;
                    })}</div>;
                })}
            </div>
        </div>

    );
}