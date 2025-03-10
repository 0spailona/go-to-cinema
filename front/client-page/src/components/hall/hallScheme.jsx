import Place from "./Place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {changePlaceStatus, changeSelectedPlaces} from "../../redux/slices/cinema.js";
import {placesType} from "../../js/info.js";

export default function HallScheme({hall}) {

    const dispatch = useDispatch();

    const {chosenSeance} = useSelector(state => state.cinema);
console.log("HallScheme chosenSeance",chosenSeance);

    for (let place of chosenSeance.takenPlaces) {
        dispatch(changePlaceStatus({
            rowIndex: place.rowIndex,
            placeIndex: place.placeIndex,
            newStatus: placesType.taken
        }));
    }

    const onPlaceChange = (rowIndex, placeIndex, newStatus, isSelected, lastStatus) => {
        dispatch(changeSelectedPlaces({rowIndex, placeIndex, isSelected, lastStatus}));
        dispatch(changePlaceStatus({rowIndex, placeIndex, newStatus}));
    };


    return (
        <div className="buying-scheme__wrapper">
            {hall?.places.map((row, rowIndex) => {
                return <div className="buying-scheme__row" key={rowIndex}>{row.map((place, placeIndex) => {
                    return <Place status={place} key={`${rowIndex}-${placeIndex}`}
                                  onChange={(newStatus, isSelected) => onPlaceChange(rowIndex, placeIndex, newStatus, isSelected, place)}/>;
                })}</div>;
            })}
        </div>
    );
}