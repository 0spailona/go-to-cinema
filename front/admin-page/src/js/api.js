import {getArrFromSeances, getHallsObj} from "../redux/utils.js";
import {toISOStringNoMs} from "./utils.js";

const basedUrl = "admin/";

export async function fetchToken() {
    const response = await fetch(`${basedUrl}api/csrf`);
    return response.text();
}

const token = await fetchToken();

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
    console.log("getHalls response.json()", json);
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


    console.log("getHallConfig response.json()", json);

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

    console.log("createHall response.json()", json);

    if (Math.floor(response.status / 100) === 2) {
        return {status: "success"};
    }
    else {
        console.log("createHall error");
        return {status: "error"};
    }
}



