import {getSeanceHallWidth} from "./info.js";

export const getValidationError = (value, min, max) => {
    if (isNaN(value)) {
        return "Введите, пожалуйста целое число";
    }
    if (value < min) {
        return `Число должно быть больше ${min}`;
    }
    if (value > max) {
        return `Число должно быть меньше ${max}`;
    }
    return null;
};

export const getPxPerMinute = () => getSeanceHallWidth() / (24 * 60);


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

export function toISOStringNoMs(date) {
     //console.log("date",date)
    return date.toISOString().replace(/\.\d+/, "");
}

export function checkDropInHall(itemOnDragX, width, hallWidth, dragMovie, seances, movies) {

    //console.log("checkDropInHall itemOnDragX", itemOnDragX, "width",width,"hallWidth",hallWidth);

    if (itemOnDragX < -10 || itemOnDragX + width > hallWidth + 10) {
        return false;
    }
    const startTime = pxToMinutes(itemOnDragX);
    const endTime = startTime + dragMovie.duration;

    for (let seance of seances) {
        //console.log("checkDropInHall seance", seance);
            const endSeance = seance.start + movies[seance.movieId].duration;

            if((startTime > seance.start && startTime < endSeance) ||
                (endTime > seance.start && endTime < endSeance)) {
                //console.log("checkDropInHall ", false);
                return false;
            }
    }

    return true;
}

export function getSeancesObj(halls,seances) {
    const hallsIds = Object.keys(halls);
    //console.log("getSeancesObj seances",seances);
    const result = {};

    for(let hallId of hallsIds){
        const seancesForHall = seances.filter(x => x.hallId === hallId);
        seancesForHall.map(x=>{
            const date = new Date(x.startTime)
            x.startTime = date.getHours() * 60 + date.getMinutes()
            return x
        })

        result[hallId] = {seances:seancesForHall};
    }

    //console.log("getSeancesObj", result);

    return result;
}
