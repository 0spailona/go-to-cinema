import {months} from "./info.js";

export function getDateStringFromDate(date) {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
}


export function toISOStringNoMs(date) {
    return date.toISOString().replace(/\.\d+/, "");
}

export function getStartTimeStringFromMinutes(startTime) {

    const date = new Date(startTime);
    const minutes = date.getHours() * 60 + date.getMinutes();
    let hours = Math.floor(minutes / 60);
    hours = hours > 9 ? hours : "0" + hours;
    let min = minutes % 60;
    min = min > 9 ? min : "0" + min;

    return {hours, min};
}

export function  isEqual  (a, b)  {
    return getDateStringFromDate(a) === getDateStringFromDate(b);
}

export  function getPlacesForView (places)  {
    let view = "";
    for (let i = 0; i < places.length; i++) {
        const separator = i === places.length - 1 ? "" : ", ";
        view = `${view}ряд ${places[i].rowIndex + 1} место ${places[i].placeIndex + 1}${separator}`;
    }
    return view;
}


