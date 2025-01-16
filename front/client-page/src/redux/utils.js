import {placesType} from "../../../admin-page/src/js/info.js";
import {fillPlacesByStandard} from "../js/modelUtils.js";
import * as movie from "./slices/cinema.js";

export function getObjMovies(arr) {
    const obj = {};
    for (let movie of arr) {
        //console.log("getHallsObj hall",hall)
        obj[movie.id] = {...movie, releaseYear: movie.release_year, release_year: undefined};
        //console.log("getObjMovies obj", obj[movie.id]);
    }
    //console.log("getHallsObj obj",obj);
    return obj;
}

const basedUrl = "";


export async function fetchToken() {
    const response = await fetch(`${basedUrl}api/csrf`);
    return response.text();
}


export function getHallsObj(arr) {

    //console.log("getHallsObj",arr);

    const obj = {};
    for (let hall of arr) {
        obj[hall.id] = {name:hall.name,id:hall.id,rowCount:hall.rowsCount,placeInRowCount:hall.placesInRow};

        const places = fillPlacesByStandard([], hall.rowsCount, hall.placesInRow);

        const hallPlaces = JSON.parse(hall.places)
        for (let p of hallPlaces.vip) {
            places[p.row][p.place] = placesType.vip;
        }

        for (let p of hallPlaces.disabled) {
            places[p.row][p.place] = placesType.disabled;
        }
        obj[hall.id].places = places;
        obj[hall.id].prices = {
            vip: hall.vipPrice,
            standard: hall.standardPrice,
        };
        //console.log("getHallsObj obj",obj[hall.name])
    }
    //console.log("getHallsObj obj",obj);
    return obj;
}
