import {placesType} from "../../../admin-page/src/js/info.js";
import {fillPlacesByStandard} from "../js/modelUtils.js";

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

const basedUrl = "client/";


export async function fetchToken() {
    const response = await fetch(`${basedUrl}api/csrf`);
    return response.text();
}

export function getSeancesObj(moviesIds, seances) {
    console.log("getSeancesObj seances", seances);
    console.log("getSeancesObj movies", moviesIds);

    const obj = {};

    for (let movieId of moviesIds) {
        obj[movieId] = {seances:[]};
        for (let seance of seances) {
            if (seance.movieId === movieId) {
                const seanceObj = {};
                seanceObj.id = seance.id;
                seanceObj.filmId = seance.movieId;
                seanceObj.hallId = seance.hallId;
                const date = new Date(seance.startTime)
                seanceObj.start = date.getHours() * 60 + date.getMinutes();
                obj[movieId].seances.push(seanceObj);
            }
        }
    }

    console.log("getSeancesObj", obj);

    return obj;
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
    console.log("getHallsObj obj",obj);
    return obj;
}
