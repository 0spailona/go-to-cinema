import {getHallsObj, getObjMovies, getSeancesObj} from "./utils.js";
//import {getHallsObj} from "../../../admin-page/src/redux/utils.js";

const basedUrl = "";


//get token;
export async function fetchToken() {
    const response = await fetch(`${basedUrl}api/csrf`);
    return response.text();
}

const token = await fetchToken();

export async function isOpenSails() {

    const response = await fetch(`${basedUrl}api/isOpenSails`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const json = await response.json();
    //console.log(json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success", data: json.data};
    }

    return {status: "error"};
}


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

export async function getSeancesByDate(date) {

    const response = await fetch(`${basedUrl}api/seancesListByDate?date=${date}`, {
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
    console.log("getSeanceById id", id);
    const response = await fetch(`${basedUrl}api/seance/${id}`, {
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });
    //return response.json();

    const json = await response.json();
    console.log("getSeanceById json", json);
    if (Math.floor(response.status / 100) === 2) {
        //const seances = getSeancesObj(json.seance)
        return {status: "success", data: json.seance};
    }

    return {status: "error"};
}

export async function getQR(data) {
    console.log("getQR data ", data);

    //try {
    const body = {
        seanceId: data.seanceId,
        places: data.places.map(place => {return {row:place.rowIndex,place:place.placeIndex,status:place.lastStatus}})
    };
    //console.log("getQR body", body);
    const response = await fetch(`${basedUrl}api/getQR`, {
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

    console.log("getQR response.json()", json);
    if (Math.floor(response.status / 100) === 2) {
        console.log("getQR success");
        return {status: "success"};
    }
    else {
        console.log("getGR error");
        return {status: "error"};
    }
}
