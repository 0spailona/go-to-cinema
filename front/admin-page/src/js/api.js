import {getArrFromSeances,getPlacesObj,getObjMovies,getHallsObj} from './modelUtils.js'
import {toISOStringNoMs} from "./utils.js";

const baseUrl = "/admin";
const apiUrl = `${baseUrl}/api`;

//get token;
export async function fetchToken() {
    const response = await fetch(`${apiUrl}/csrf`);
    return response.text();
}

const token = await fetchToken();

//Global

export async function isAdmin() {
    const response = await fetch(`${apiUrl}/isAdmin`);

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        if (json.isAdmin) {
            return {status: "success"};
        }
        else {
            window.location = `${baseUrl}/login`;
        }

    }
    else {
        return {status: "error"};
    }
}

export async function logOut() {
    window.location = `${baseUrl}/logout`;
}

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

export async function openSails() {
    const response = await fetch(`${apiUrl}/openSails`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        return {status: "error"};
    }
}

export async function closeSails() {

    const response = await fetch(`${apiUrl}/closeSails`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });


    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        return {status: "error"};
    }
}


// API for seances
export async function getSeancesByDate(date) {

    const response = await fetch(`${apiUrl}/seancesListByDate?date=${date}`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {

        return {status: "success", data: json.seances};
    }

    return {status: "error"};
}

export async function updateSeances(data) {

    const body = {
        seances: getArrFromSeances(data.seances, data.date
        ), date: toISOStringNoMs(data.date)
    };

    const response = await fetch(`${apiUrl}/updateSeances`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(body),
    });

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        return {status: "error"};
    }
}

//API for halls

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

export async function getHallConfig() {
    const response = await fetch(`${apiUrl}/hallConfig`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success", data: json.hallConfig};
    }
    else {
        return {status: "error"};
    }

}

export async function createHall(name) {
    const response = await fetch(`${apiUrl}/newHall`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
        body: name
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        if (response.status === 400) {
            return {status: "error", message: json.message};
        }
        else {
            return {status: "error"};
        }
    }
}

export async function removeHall(id) {
    const response = await fetch(`${apiUrl}/removeHall`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
            "Content-Type": "text/plain",
        },
        method: "POST",
        credentials: "same-origin",
        body: id
    });
    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else if (response.status === 400) {
        return {status: "error", message: json.message};
    }
    else {
        return {status: "error"};
    }
}


export async function updatePlacesInHall(hall) {

    const places = getPlacesObj(hall.places);
    const body = JSON.stringify({
        id: hall.id,
        places,
        rowsCount: hall.rowsCount,
        placesInRow: hall.placesInRow
    });

    const response = await fetch(`${apiUrl}/updatePlacesInHall`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
            "Content-Type": "text/plain",
        },
        method: "POST",
        credentials: "same-origin",
        body: body
    });
    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        return {status: "error", message: json.message};
    }

}

export async function updatePricesInHall(hall) {

    const body = JSON.stringify({
        id: hall.id,
        vipPrice: hall.prices.vip,
        standardPrice: hall.prices.standard
    });

    const response = await fetch(`${apiUrl}/updatePricesInHall`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
            "Content-Type": "text/plain",
        },
        method: "POST",
        credentials: "same-origin",
        body: body
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        if (response.status === 400) {
            return {status: "error", message: json.message};
        }
        else {
            return {status: "error"};
        }
    }

}

//API for movies

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
        return {status: "error"};
    }
}

export async function createMovie(data) {
    const response = await fetch(`${apiUrl}/newMovie`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        return {status: "error", message: json.message};
    }
}


export async function removeMovieFromList(id) {

    const response = await fetch(`${apiUrl}/removeMovie?id=${id}`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });

    const json = await response.json();


    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        return {status: "error", message: json.message};
    }
}

export async function sendPosterToServer(formData) {

    const response = await fetch(`${apiUrl}/poster`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
        body: formData,
    });

    const json = await response.json();

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else if (response.status === 413) {
        return {status: "error", message: "Слишком большой файл"};
    }
    else if (response.status === 415) {
        return {status: "error", message: `${json.mimeType} не подходит для постера`};
    }
    else {
        return {status: "error", message: "Что-то пошло не так"};
    }
}





