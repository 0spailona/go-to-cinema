import Place from "./Place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {changeChosenPlaces, changePlaceStatus} from "../../redux/slices/cinema.js";

export default function HallScheme() {

    const dispatch = useDispatch();

    const {chosenSeance,halls
    } = useSelector(state => state.cinema);

    const hall = halls[chosenSeance.hallId];

    const onPlaceChange = (rowIndex, placeIndex, newStatus,isSelected) => {

        dispatch(changeChosenPlaces({rowIndex, placeIndex,isSelected}))
        dispatch(changePlaceStatus({rowIndex, placeIndex, newStatus}));
    };

    return (
        <div className="buying-scheme__wrapper">
            {hall.places.map((row, rowIndex) => {
                return <div className="buying-scheme__row" key={rowIndex}>{row.map((place, placeIndex) => {
                    return <Place status={place} key={`${rowIndex}-${placeIndex}`}
                                  onChange={(newStatus,isSelected) => onPlaceChange(rowIndex, placeIndex, newStatus,isSelected)}/>;
                })}</div>;
            })}
        </div>

    );
}