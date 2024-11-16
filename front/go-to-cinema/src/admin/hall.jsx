import Place from "./place.jsx";



// eslint-disable-next-line react/prop-types
export default function Hall({rowCount,placesInRow,disabled,vip}) {
    const rows = [...Array(rowCount).keys()].map((_, i) => i+1);
    const places = [...Array(placesInRow).keys()].map((_, i) => i+1);
    const getPlaceStatus = (row,place) => {
       for(let disable of disabled){
           if(disable.row === row && disable.place === place){
               return "disabled";
           }
       }
       for(let vipPlace of vip){
           if(vipPlace.row === row && vipPlace.place === place){
               return "vip";
           }
       }
           return "standart";

    }
    return (
        <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
                {rows.map(row=> {
                    return <div className="conf-step__row" key={row}>{places.map(place=> {
                    return <Place status={getPlaceStatus(row,place)} key={`${place}-${row}`}/>
                    })}</div>
                })}
            </div>
        </div>

    )
                }