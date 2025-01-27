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
        obj[hall.id] = {name:hall.name,id:hall.id,rowsCount:hall.rowsCount,placesInRow: hall.placesInRow};
        const places = fillPlacesByStandard([], hall.rowsCount, hall.placesInRow);
        const hallPlaces = JSON.parse(hall.places)
        //console.log("getHallsObj hallPlaces",hallPlaces);
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


export function createSeance(movieId, startTime, index) {
    const id = `seance-${index}`;
    return {
        id, movieId, startTime
    };
}


export function getArrFromSeances(seances, date) {
    const arr = [];

    for (let hallId of Object.keys(seances)) {
        for (let seance of seances[hallId].seances) {

            const startTime = new Date(date.getTime())
            startTime.setHours(Math.trunc(seance.startTime / 60), seance.startTime % 60);

            const id = seance.id.includes("seance-") ? null : seance.id;
//console.log("getArrFromSeances startTime",date)
            let obj = {hallId,movieId:seance.movieId,startTime:toISOStringNoMs(startTime)};
            if(id){
                 obj.id = id
            }
            arr.push(obj);
        }
    }
    //console.log("getArrFromSeances", arr);
    return arr;
}



