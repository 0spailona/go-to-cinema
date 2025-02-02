import {placesType} from "./info.js";
import {toISOStringNoMs} from "./utils.js";

const templates = {
    "standard": {
        rowCount: 10,
        placeInRowCount: 8,
        disabled: [
            {row: 0, place: 0}, {row: 0, place: 1}, {row: 0, place: 2},
            {row: 0, place: 5}, {row: 0, place: 6}, {row: 0, place: 7},
            {row: 1, place: 0}, {row: 1, place: 1}, {row: 1, place: 6}, {row: 1, place: 7},
            {row: 2, place: 0}, {row: 2, place: 7},
            {row: 3, place: 7},
            {row: 4, place: 7},
            {row: 5, place: 7},
            {row: 6, place: 7},
            {row: 7, place: 7},
        ],
        vip: [
            {row: 3, place: 2}, {row: 3, place: 3},
            {row: 4, place: 2}, {row: 4, place: 3}, {row: 4, place: 4}, {row: 4, place: 5},
            {row: 5, place: 2}, {row: 5, place: 3}, {row: 5, place: 4}, {row: 5, place: 5},
            {row: 6, place: 2}, {row: 6, place: 3}, {row: 6, place: 4}, {row: 6, place: 5},
        ],
        prices: {
            vip: 350,
            standard: 0,
        },

    }
};

let nextCountHall = 0;

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


export function createHall(name, templateId) {
    nextCountHall++;
    const id = `hall-${nextCountHall}`;
    const template = templates[templateId];
    if (!template) {
        throw new Error("Unknown template " + templateId);
    }

    const places = fillPlacesByStandard([], template.rowCount, template.placeInRowCount);

    for (let p of template.vip) {
        places[p.row][p.place] = placesType.vip;
    }

    for (let p of template.disabled) {
        places[p.row][p.place] = placesType.disabled;
    }

    return {
        id, name,
        movies: [],
        rowCount: template.rowCount,
        placeInRowCount: template.placeInRowCount,
        places,
        prices: {...template.prices}
    };
}

export function getArrFromSeances(seances, date) {
    const arr = [];

    for (let hallId of Object.keys(seances)) {
        for (let seance of seances[hallId].seances) {

            const startTime = new Date(date.getTime());
            startTime.setHours(Math.trunc(seance.startTime / 60), seance.startTime % 60);

            const id = seance.id.includes("seance-") ? null : seance.id;

            let obj = {hallId, movieId: seance.movieId, startTime: toISOStringNoMs(startTime)};
            if (id) {
                obj.id = id;
            }
            arr.push(obj);
        }
    }

    return arr;
}

export function getPlacesObj(arr) {

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

    return places;
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