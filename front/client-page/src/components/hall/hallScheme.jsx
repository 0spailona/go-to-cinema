import Place from "./Place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {changePlaceStatus, changeSelectedPlaces} from "../../redux/slices/cinema.js";
import {placesType} from "../../js/info.js";

export default function HallScheme() {

    const dispatch = useDispatch();

    const {
        chosenSeance, halls
    } = useSelector(state => state.cinema);

    const hall = halls[chosenSeance.seanceData.hallId];



    const selectedPlaces = chosenSeance.selectedPlaces;
    const places = [...hall.places]
    for (let place of selectedPlaces) {
        console.log(place)
        console.log("places[place.row][place.place]",places[place.row][place.place])
        dispatch(changePlaceStatus({rowIndex:place.row, placeIndex:place.place, newStatus:placesType.taken}));
        //places[place.row][place.place] = placesType.taken;
    }
    console.log("HallScheme places", places);

    const onPlaceChange = (rowIndex, placeIndex, newStatus, isSelected, lastStatus) => {
        dispatch(changeSelectedPlaces({rowIndex, placeIndex, isSelected, lastStatus}));
        dispatch(changePlaceStatus({rowIndex, placeIndex, newStatus}));
    };

    return (
        <div className="buying-scheme__wrapper">
            {hall.places.map((row, rowIndex) => {
                return <div className="buying-scheme__row" key={rowIndex}>{row.map((place, placeIndex) => {
                    return <Place status={place} key={`${rowIndex}-${placeIndex}`}
                                  onChange={(newStatus, isSelected) => onPlaceChange(rowIndex, placeIndex, newStatus, isSelected, place)}/>;
                })}</div>;
            })}
        </div>

    );
}