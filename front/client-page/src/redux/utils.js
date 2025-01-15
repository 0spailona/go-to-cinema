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

/*
    movieId: {
        hallId: {
            seanceId: {seanseData},
            seanceId: {seanseData}
        },
        hallId: {
            seanceId: {seanseData}
        },
    }
}
*/

/*export function getSeancesObj2( seances ) {
    const movieIds = [ ...new Set(seances.map(x => x.movieId))];
    const result = {};

    for (let movieId of movieIds) {
        const seancesForMovie = seances.filter(x => x.movieId === movieId);
        const hallIdsForMovie = [ ...new Set(seancesForMovie.map(x => x.hallId))];
        result[movieId] = Object.fromEntries(hallIdsForMovie.map(x => [x, seancesForMovie.filter(y => y.hallId === x)]));
    }
    return result;
}




export function getSeancesObj(moviesIds, seances,halls) {
    //console.log("getSeancesObj seances", seances);
    //console.log("getSeancesObj movies", moviesIds);

    const obj = {};



/*
    for (let movieId of moviesIds) {
        obj[movieId] = {halls:[]};
        for(let hall of halls) {
            let hallObj = {seances:[]};
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

    }

    //console.log("getSeancesObj", obj);

    return obj;
}*/


export function getHallsObj(arr) {

    //console.log("getHallsObj",arr);

    const obj = {};
    for (let hall of arr) {
        //console.log("getHallsObj hall",hall)
        obj[hall.id] = {};
        obj[hall.id].name = hall.name;
        obj[hall.id].id = hall.id;
        obj[hall.id].rowCount = hall.rowsCount;
        obj[hall.id].placeInRowCount = hall.placesInRow;

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
