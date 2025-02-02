import {placesType} from "./info.js";

export function fillPlacesByStandard(places, rowCount, placeInRowCount) {
    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < placeInRowCount; j++) {
            row.push(placesType.standard);
        }
        places.push(row);
    }
    return places;
}


export function getSeancesObj(seances) {

    if (seances.length === 0) {
        return {};
    }
    const movieIds = [...new Set(seances.map(x => x.movieId))];
    const result = {};

    for (let movieId of movieIds) {
        const seancesForMovie = seances.filter(x => x.movieId === movieId);
        const hallIdsForMovie = [...new Set(seancesForMovie.map(x => x.hallId))];
        result[movieId] = Object.fromEntries(hallIdsForMovie.map(x => [x, seancesForMovie.filter(y => y.hallId === x)]));
    }
    return result;
}

export function getObjMovies(arr) {
    const obj = {};
    for (let movie of arr) {
        obj[movie.id] = {...movie, releaseYear: movie.release_year, release_year: undefined};
    }
    return obj;
}

export function getHallsObj(arr) {

    const obj = {};
    for (let hall of arr) {
        obj[hall.id] = {name: hall.name, id: hall.id, rowsCount: hall.rowsCount, placesInRow: hall.placesInRow};
        const places = fillPlacesByStandard([], hall.rowsCount, hall.placesInRow);
        const hallPlaces = JSON.parse(hall.places);

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
    }

    return obj;
}


