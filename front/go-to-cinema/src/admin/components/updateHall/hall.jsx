import Place from "../common/place.jsx";
import {useAppSelector} from "../../../redux/hooks.js";


// eslint-disable-next-line react/prop-types
export default function Hall({hallId}) {

    const {
        halls,
    } = useAppSelector(state => state.halls);

    const hall = halls[hallId];
    const rowCount = hall.custom.rowCount ? hall.custom.rowCount : hall.type.rows;
    const placesInRow = hall.custom.placesInRow ? hall.custom.placesInRow : hall.type.placesInRow;
    const disabled = hall.custom.disabled.length ? hall.custom.disabled : hall.type.disabled;
    const vip = hall.custom.vip.length ? hall.custom.vip : hall.type.vip;
    const rows = [...Array(rowCount).keys()].map((_, i) => i + 1);
    const places = [...Array(placesInRow).keys()].map((_, i) => i + 1);

    const getPlaceStatus = (row, place) => {
        for (let disable of disabled) {
            if (disable.row === row && disable.place === place) {
                return "disabled";
            }
        }
        for (let vipPlace of vip) {
            if (vipPlace.row === row && vipPlace.place === place) {
                return "vip";
            }
        }
        return "standart";

    };
    return (
        <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
                {rows.map(row => {
                    return <div className="conf-step__row" key={row}>{places.map(place => {
                        return <Place status={getPlaceStatus(row, place)} key={`${place}-${row}`}/>;
                    })}</div>;
                })}
            </div>
        </div>

    );
}