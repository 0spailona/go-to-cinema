import {getHallsObj, getObjMovies, getSeancesObj} from "./modelUtils.js";

const baseUrl = "";
const apiUrl = `${baseUrl}/api`;


//get token;
export async function fetchToken() {
    const response = await fetch(`${apiUrl}/csrf`);
    return response.text();
}

const token = await fetchToken();

export async function isOpenSails() {

    const response = await fetch(`${apiUrl}/isOpenSails`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });


    if (Math.floor(response.status / 100) === 2) {
        const json = await response.json();
        return {status: "success", data: json.data};
    }

    return {status: "error"};
}

export async function getMovies() {
    const response = await fetch(`${apiUrl}/moviesList`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {

        const movies = getObjMovies(json.movies);
        return {status: "success", data: movies};
    }
    else {
        console.log("getMovies error");
        return {status: "error"};
    }
}

export async function getHalls() {
    const response = await fetch(`${apiUrl}/hallsList`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {

        const halls = getHallsObj(json.halls);
        return {status: "success", data: halls};
    }
    else {
        return {status: "error"};
    }
}

export async function getSeancesByDate(date) {

    const response = await fetch(`${apiUrl}/seancesListByDate?date=${date}`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        const seances = getSeancesObj(json.seances);
        return {status: "success", data: seances};
    }

    return {status: "error"};
}

export async function getSeanceById(id) {

    const response = await fetch(`${apiUrl}/seance/${id}`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {

        let arr = [];
        for (let place of json.places) {
            arr.push({rowIndex: place.row, placeIndex: place.place});
        }

        return {status: "success", data: {seance: json.seance, takenPlaces: arr}};
    }

    return {status: "error"};
}

export async function toBook(data) {

    const body = {
        seanceId: data.seanceId,
        places: data.places.map(place => {
            return {row: place.rowIndex, place: place.placeIndex, status: place.lastStatus};
        })
    };

    const response = await fetch(`${apiUrl}/toBook`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(body),
    });
    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success", data: json.data};
    }
    else {
        return {status: "error",message:json.message};
    }
}
