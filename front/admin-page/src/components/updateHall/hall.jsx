import Place from "../common/place.jsx";
import {useDispatch, useSelector} from "react-redux";
import {changePlaceStatus, fetchHalls} from "../../redux/slices/halls.js";
import {useEffect, useState} from "react";

export default function Hall({hallName,onUpdate}) {

    const dispatch = useDispatch();

    const {
        halls,chairsUpdateHall
    } = useSelector(state => state.halls);

    //const [hall, setHall] = useState(halls[chairsUpdateHall.name])
    useEffect(() => {
        dispatch(fetchHalls());
        //setHall(halls[chairsUpdateHall.name])
    }, []);

    const hall = halls[hallName];
    //console.log("hall", hall);
    //console.log("hall halls",halls)
    //console.log("hallName", hallName);

    const onPlaceChange = (rowIndex, placeIndex, newStatus) => {
        //console.log("onPlaceChange", rowIndex, placeIndex, newStatus);
        dispatch(changePlaceStatus({hallName, rowIndex, placeIndex, newStatus}));
        onUpdate()
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