import {getArrFromSeances, getHallsObj, getObjMovies, getPlacesObj} from "../redux/utils.js";
import {toISOStringNoMs} from "./utils.js";

const basedUrl = "admin/";

//get token;
export async function fetchToken() {
    const response = await fetch(`${basedUrl}api/csrf`);
    return response.text();
}

const token = await fetchToken();

//Global

export async function isAdmin() {
    const response = await fetch(`${basedUrl}isAdmin`);

    //console.log("fetchToken", response);

    const json = await response.json();

    console.log("closeSails response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        if (json.isAdmin) {
            return {status: "success"};
        }
        else {
            window.location = "admin/login";
        }

    }
    else {
        // console.log("createHall error");
        return {status: "error"};
    }
}

export async function logOut() {
    const response = await fetch(`${basedUrl}api/logout`,{
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });

    //console.log("fetchToken", response);

    const json = await response.json();

    console.log("closeSails logout.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        // console.log("createHall error");
        return {status: "error"};
    }
}


export async function openSails() {
    const response = await fetch(`${basedUrl}api/openSails`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });

    // const json = await response.json();

    //console.log("createHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        // console.log("createHall error");
        return {status: "error"};
    }
}

export async function closeSails() {

    //console.log("token", token);
    const response = await fetch(`${basedUrl}api/closeSails`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });

    const json = await response.json();

    console.log("closeSails response.json()", json);

    if (Math.floor(response.status / 100) === 2) {

        return {status: "success"};
    }
    else {
        // console.log("createHall error");
        return {status: "error"};
    }
}


// API for seances
export async function getSeancesByDate(date) {

    const response = await fetch(`${basedUrl}api/seancesListByDate?date=${date}`, {
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
    console.log("updateSeances data.date ", data.date);
    //try {
    const body = {
        seances: getArrFromSeances(data.seances, data.date
        ), date: toISOStringNoMs(data.date)
    };
    console.log("updateSeances body", body);
    const response = await fetch(`${basedUrl}api/updateSeances`, {
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
    console.log("updateSeances response.json()", json);
    if (Math.floor(response.status / 100) === 2) {
        console.log("updateSeances success");
        return {status: "success"};
    }
    else {
        console.log("updateSeances error");
        return {status: "error"};
    }
    //console.log("updateSeances response.json()",response);
    //return response.json();
    //}catch (e){ console.error(e); throw e;}
}

//API for halls

export async function getHalls() {
    const response = await fetch(`${basedUrl}api/hallsList`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();
    //console.log("getHalls response.json()", json);
    if (Math.floor(response.status / 100) === 2) {
        //console.log("getHalls success",json.halls);
        const halls = getHallsObj(json.halls);
        return {status: "success", data: halls};
    }
    else {
        console.log("getHalls error");
        return {status: "error"};
    }
}

export async function getHallConfig() {
    const response = await fetch(`${basedUrl}api/hallConfig`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();


    //console.log("getHallConfig response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success", data: json.hallConfig};
    }
    else {
        console.log("getHallConfig error");
        return {status: "error"};
    }

}

export async function createHall(name) {
    const response = await fetch(`${basedUrl}api/newHall`, {
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

    //console.log("createHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        // console.log("createHall error");
        return {status: "error"};
    }
}

export async function removeHall(id) {
    const response = await fetch(`${basedUrl}api/removeHall`, {
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

    //console.log("removeHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        console.log("removeHall error");
        return {status: "error", message: json.message};
    }
    // return response.json();
}


export async function updatePlacesInHall(hall) {
    console.log("updatePlacesInHall request hall", hall);
    const places = getPlacesObj(hall.places);
    const body = JSON.stringify({
        id: hall.id,
        places,
        rowsCount: hall.rowsCount,
        placesInRow: hall.placesInRow
    });

    const response = await fetch(`${basedUrl}api/updatePlacesInHall`, {
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

    //console.log("removeHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        console.log("removeHall error");
        return {status: "error", message: json.message};
    }
    //return response.json();
}

export async function updatePricesInHall(hall) {
    //console.log("updatePricesInHall request hall", hall);
    const body = JSON.stringify({
        id: hall.id,
        vipPrice: hall.prices.vip,
        standardPrice: hall.prices.standard
    });

    const response = await fetch(`${basedUrl}api/updatePricesInHall`, {
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

    //console.log("removeHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        console.log("removeHall error");
        return {status: "error", message: json.message};
    }
    //return response.json();
}

//API for movies

export async function getMovies() {
    const response = await fetch(`${basedUrl}api/moviesList`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });
    //return response.json();
    const json = await response.json();

    //console.log("removeHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {

        const movies = getObjMovies(json.movies);
        return {status: "success", data: movies};
    }
    else {
        console.log("getMovies error");
        return {status: "error"};
    }
}

export async function createMovie(data) {
    const response = await fetch(`${basedUrl}api/newMovie`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(data),
    });
    //return response.json();
    const json = await response.json();

    //console.log("createMovie response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        console.log("createMovie error");
        return {status: "error", message: json.message};
    }
}


export async function removeMovieFromList(id) {
    console.log("removeMovieFromList", id);
    const response = await fetch(`${basedUrl}api/removeMovie?id=${id}`, {
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        credentials: "same-origin",
    });
    //return response.json();
    const json = await response.json();

    //console.log("createMovie response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        console.log("removeMovieFromList error");
        return {status: "error", message: json.message};
    }
}





