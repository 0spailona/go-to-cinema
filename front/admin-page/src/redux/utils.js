//const basedUrl = import.meta.env.VITE_URL

import {placesType} from "../js/info.js";
import {toISOStringNoMs} from "../js/utils.js";

const basedUrl = "admin/";


export async function fetchToken() {
    const response = await fetch(`${basedUrl}api/csrf`);
    return response.text();
}


function fillPlacesByStandard(places, rowCount, placeInRowCount) {
    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < placeInRowCount; j++) {
            row.push(placesType.standard);
        }
        places.push(row);
    }
    return places;
}


export function getHallsObj(arr) {

    //console.log("getHallsObj",arr);

    const obj = {};
    for (let hall of arr) {
        //console.log("getHallsObj hall",hall)
        obj[hall.name] = {};
        obj[hall.name].name = hall?.name;
        obj[hall.name].rowCount = hall.rowsCount;
        obj[hall.name].placeInRowCount = hall.placesInRow;

        const places = fillPlacesByStandard([], hall.rowsCount, hall.placesInRow);

        for (let p of hall.places.vip) {
            places[p.row][p.place] = placesType.vip;
        }

        for (let p of hall.places.disabled) {
            places[p.row][p.place] = placesType.disabled;
        }
        obj[hall.name].places = places;
        obj[hall.name].prices = {
            vip: hall.vipPrice,
            standard: hall.standardPrice,
        };
        //console.log("getHallsObj obj",obj[hall.name])
    }
    //console.log("getHallsObj obj",obj);
    return obj;
}

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

export function getPlacesObj(arr) {

    //console.log("getPlacesObj arr",arr)

    const places = {vip: [], disabled: []};

    for (let rowIndex = 0; rowIndex < arr.length; rowIndex++) {
        for (let placeIndex = 0; placeIndex < arr[rowIndex].length; placeIndex++) {
            if (arr[rowIndex][placeIndex] === placesType.vip) {
                places.vip.push({row: rowIndex, place: placeIndex});
            }
            else if (arr[rowIndex][placeIndex] === placesType.disabled) {
                places.disabled.push({row: rowIndex, place: placeIndex});
            }
        }
    }
    //console.log("getPlacesObj places",places);
    return places;
}


export function createSeance(filmId, start, index) {
    const id = `seance-${index}`;
    return {
        id, filmId, start
    };
}

export function getSeancesObj(halls, seances) {
    const obj = {};
    for (let hall of halls) {
        obj[hall.id] = {hallName: hall.name, seances: []};
    }
    return obj;
}

export function getArrFromSeances(seances, date) {
    const arr = [];

    for (let hallId of Object.keys(seances)) {
        for (let seance of seances[hallId].seances) {

            const startTime = new Date(date);
            startTime.setHours(Math.trunc(seance.start / 60), seance.start % 60);

            const obj = {
                hallId,
                movieId: seance.filmId,
                startTime: toISOStringNoMs(startTime),
                id: seance.id
            };
            arr.push(obj);
        }
    }
    console.log("getArrFromSeances", arr);
    return arr;
}



