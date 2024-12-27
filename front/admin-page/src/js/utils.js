import {getSeanceHallWidth} from "./info.js";

export const getValidationError = (value, min, max) => {
    if (isNaN(value)) {
        return "Введите, пожалуйста целое число";
    }
    if(value < min){
        return `Число должно быть больше ${min}`;
    }
    if(value > max){
        return `Число должно быть меньше ${max}`;
    }
    return null;
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


