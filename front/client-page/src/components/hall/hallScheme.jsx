import Place from "./Place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {changeChosenPlaces, changePlaceStatus} from "../../redux/slices/cinema.js";

export default function HallScheme({hallId}) {

    const dispatch = useDispatch();

    const {
        halls,
    } = useSelector(state => state.cinema);

    const hall = halls[hallId];

    const onPlaceChange = (rowIndex, placeIndex, newStatus,isSelected) => {

        dispatch(changeChosenPlaces({rowIndex, placeIndex,isSelected}))
        dispatch(changePlaceStatus({hallId, rowIndex, placeIndex, newStatus}));
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