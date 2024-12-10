import {getSeanceHallWidth} from "./info.js";

export const isValid = (value) => {
    if (isNaN(value)) {
        console.log("Error. Value is invalid");
        // TODO sh ow error?
        return false;
    }
    return true;
};

export const getPxPerMinute = () =>
    getSeanceHallWidth() / (24 * 60);

export const pxToMinutes = (px) => Math.trunc(px / getPxPerMinute());
export const minutesToPx = (min) => Math.trunc(min * getPxPerMinute());

export const getViewTime = (start) =>{
    let hours = Math.trunc(start / 60);
    if (hours < 10)
        hours = '0' + hours;
    let minutes = start % 60;
    if (minutes < 10)
        minutes = '0' + minutes;
    return `${start} ${hours}:${minutes}`;
}

export const getItemOnDragX = (itemId) =>{
    const itemEl = document.getElementById(itemId);
    const parentEl = document.getElementsByClassName("conf-step__seances-timeline")[0]
    if (!itemEl || !parentEl) {
        return null;
    }
    return itemEl.getBoundingClientRect().x - parentEl.getBoundingClientRect().x;
}
