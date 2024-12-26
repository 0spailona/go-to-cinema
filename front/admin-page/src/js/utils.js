import {getSeanceHallWidth} from "./info.js";

export const isValid = (value, min, max) => {
    if (isNaN(value)) {
        console.log("Error. Value is invalid");
        // TODO show error?
        return false;
    }
    if(min && value < min){
        console.log("Error. Value is invalid, value < min");
        // TODO show error?
        return false;
    }
    if(max && value > max){
        console.log("Error. Value is invalid, value > max");
        console.log("max",max)
        // TODO show error?
        return false;
    }
    return true;
};

export const getPxPerMinute = () =>
    getSeanceHallWidth() / (24 * 60);

export const pxToMinutes = (px) => Math.trunc(px / getPxPerMinute());
export const minutesToPx = (min) => Math.trunc(min * getPxPerMinute());

export const getViewTime = (start) => {
    let hours = Math.trunc(start / 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    let minutes = start % 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return `${hours}:${minutes}`;
};

export const getItemOnDragX = (itemId) => {
    const itemEl = document.getElementById(itemId);
    const parentEl = document.getElementsByClassName("conf-step__seances-timeline")[0];
    if (!itemEl || !parentEl) {
        return null;
    }
    return itemEl.getBoundingClientRect().x - parentEl.getBoundingClientRect().x;
};

/*export function getPlacesObj(arr){

    //console.log("getPlacesObj arr",arr)

    const places = {vip:[],disabled:[]}

    for(let rowIndex = 0; rowIndex < arr.length; rowIndex++) {
        for(let placeIndex = 0; placeIndex < arr[rowIndex].length; placeIndex++) {
            if(arr[rowIndex][placeIndex]===placesType.vip){
                places.vip.push({row: rowIndex, place: placeIndex})
            } else if (arr[rowIndex][placeIndex]===placesType.disabled){
                places.disabled.push({row: rowIndex, place: placeIndex})
            }
        }
    }
    //console.log("getPlacesObj places",places);
return places;
}*/
