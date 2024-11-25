import {placesType} from "./info.js";

const templates = {
    'standart': {
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
            standart: 0,
        },

    }
};


export function createHall(id, name, templateId) {
    const template = templates[templateId];
    if (!template) {
        throw new Error("Unknown template " + templateId);
    }

    const places = [];

    for (let i = 0; i < template.rowCount; i++){
        const row = [];
        for (let j = 0; j < template.placeInRowCount; j++) {
            row.push(placesType.standart);
        }
        places.push(row);
    }

    console.log("places", places);

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
        prices: {...template.prices},
    };
}