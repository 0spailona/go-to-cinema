//const basedUrl = import.meta.env.VITE_URL
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {placesType, selectedHallType} from "../../js/info.js";
import {createHall, fillPlacesByStandard} from "../../js/modelUtils.js";
import {fetchToken, getHallsObj, getPlacesObj} from "../utils.js";
//192.168.23.15:3002
//const basedUrl = import.meta.env.VITE_URL; //http://127.0.0.1:8000/admin/
const basedUrl = "admin/";
//console.log("basedUrl", basedUrl);
const token = await fetchToken();
//console.log("fetchToken",await fetchToken());

const hall1 = createHall("Зал 1", "standard");
const hall2 = createHall("Зал 2", "standard");

//const tokenHalls = token;

export const fetchHalls = createAsyncThunk(
    "fetchHalls",
    async () => {
        //console.log("fetch", `${basedUrl}api/hallsList`)
        const response = await fetch(`${basedUrl}api/hallsList`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        //console.log("cookies", response.headers.getSetCookie());
        return response.json();
    }
);

export const fetchNewHall = createAsyncThunk(
    "fetchNewHall",
    async (name) => {
        //console.log("tokenHalls", tokenHalls);
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
        return response.json();
    }
);

export const removeHallByName = createAsyncThunk(
    "removeHallByName",
    async (name) => {
        const response = await fetch(`${basedUrl}api/removeHall`, {
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": token,
                "Content-Type": "text/plain",
            },
            method: "POST",
            credentials: "same-origin",
            body: name
        });
        return response.json();
    }
);

export const updatePlacesInHall = createAsyncThunk(
    "updatePlacesInHall",
    async (hall) => {
        const places = getPlacesObj(hall.places)
        const body = JSON.stringify({hallName:hall.name,places,rowCount:hall.rowCount,placesInRow:hall.placeInRowCount});

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
        return response.json();
    }
);

const initialState = {
    loadingSeances: true,
    loadingHalls: true,
    error: "",
    halls: null,
    chairsUpdateHall: null,
    pricesUpdateHall: {id: "h-1", isUpdated: false}
};

const hallsSlice = createSlice({
        name: "halls",
        initialState,
        selectors: {
            halls: (state => state.halls),
            hallsId: (state => state.hallsId),
            loadingSeances: (state => state.loadingSeances),
            loadingHalls: (state => state.loadingHalls),
            chairsUpdateHall: (state => state.chairsUpdateHall),
            pricesUpdateHall: (state => state.pricesUpdateHall),
        },
        reducers: {
            addFilmToHall: (state, action) => {
                console.log("addFilmToHall", action.payload.from, action.payload.to, action.payload.film);
                state.halls[action.payload.to].movies.push(action.payload.film);
                //const newFilm = action.payload.movie;
                //state.halls[action.payload.hallId].movies.push(newFilm);
            },
            changeSelectedHall: (state, action) => {
                console.log("changeSelectedHall", action.payload);
                if (action.payload.target === selectedHallType.chairs) {
                    state.chairsUpdateHall = {name: action.payload.hallName, isUpdated: false};
                }
                if (action.payload.target === selectedHallType.prices) {
                    state.pricesUpdateHall = {name: action.payload.hallName, isUpdated: false};
                }
            },
            updateCustomRows: (state, action) => {
                console.log("slice halls update rows");
                const newRowCount = action.payload.rows;
                const hall = state.halls[action.payload.hallId];
                const oldRowCount = hall.rowCount;
                const difference = newRowCount - oldRowCount;

                hall.places = difference < 0 ? hall.places.splice(0, newRowCount) :
                    difference > 0 ? fillPlacesByStandard(hall.places, difference, hall.placeInRowCount) : hall.places;

                state.chairsUpdateHall.isUpdated = true;
                hall.rowCount = newRowCount;

            },
            updateCustomPlaces: (state, action) => {
                console.log("slice halls update places");
                const newPlacesInRow = action.payload.places;
                const hall = state.halls[action.payload.hallId];
                const oldPlaceInRowCount = hall.placeInRowCount;
                const difference = newPlacesInRow - oldPlaceInRowCount;
                if (difference !== 0) {
                    if (difference < 0) {
                        for (let row of hall.places) {
                            row.splice(0, Math.abs(difference));
                        }
                    }
                    else {
                        for (let row of hall.places) {
                            const newPlaces = Array(difference).fill(placesType.standard);
                            row.push(...newPlaces);
                        }
                    }
                    state.chairsUpdateHall.isUpdated = true;
                    hall.placeInRowCount = newPlacesInRow;
                }
            },
            updatePrice: (state, action) => {
                const newPrice = action.payload.price;
                const hall = state.halls[action.payload.hallId];
                if (action.payload.type === placesType.vip && hall.prices.vip !== newPrice) {
                    console.log("slice halls update vip Price");
                    hall.prices.vip = newPrice;
                    state.pricesUpdateHall.isUpdated = true;
                }
                else if (action.payload.type === placesType.standard && hall.prices.standard !== newPrice) {
                    console.log("slice halls update standard Price");
                    hall.prices.standard = newPrice;
                    state.pricesUpdateHall.isUpdated = true;
                }
            },
            changePlaceStatus: (state, action) => {
                //console.log("slice halls change PlaceStatus");
                const rowIndex = action.payload.rowIndex;
                const placeIndex = action.payload.placeIndex;
                state.halls[action.payload.hallName].places[rowIndex][placeIndex] = action.payload.newStatus;
                state.chairsUpdateHall.isUpdated = true;
            }
        },
        extraReducers: builder => {
            // get all halls
            builder.addCase(fetchHalls.pending, (state, action) => {
                state.loadingHalls = true;
            });
            builder.addCase(fetchHalls.fulfilled, (state, action) => {
                const hallsArr = action.payload.data;
                state.halls = getHallsObj(hallsArr);
                if(state.chairsUpdateHall === null){
                    state.chairsUpdateHall = {name: hallsArr[0].name, isUpdated: false};
                }
                state.loadingHalls = false;
            });
            builder.addCase(fetchHalls.rejected, (state, action) => {
                state.loadingHalls = false;
                state.error = "Проблема на стороне сервера";
                console.log("fetchHalls rejected action", action.payload);
            });

            // create new hall
            builder.addCase(fetchNewHall.pending, (state, action) => {
                state.loadingHalls = true;
            });
            builder.addCase(fetchNewHall.fulfilled, (state, action) => {
                state.loadingHalls = false;
                if (action.payload.status !== "ok") {
                    state.error = action.payload.message;
                }
            });
            builder.addCase(fetchNewHall.rejected, (state, action) => {
                state.error = "Проблема на стороне сервера";
                state.loadingHalls = false;
            });

            //remove hall
            builder.addCase(removeHallByName.pending, (state, action) => {
                state.loadingHalls = true;
            });
            builder.addCase(removeHallByName.fulfilled, (state, action) => {
                state.loadingHalls = false;
                //console.log("removeHalls fulfilled action", action.payload);
                if (action.payload.status !== "ok") {
                    state.error = action.payload.message;
                }
            });
            builder.addCase(removeHallByName.rejected, (state, action) => {
                state.error = "Проблема на стороне сервера";
                //console.log("removeHalls rejected  action", action.payload);
                state.loadingHalls = false;
            });

            // update places in hall
            builder.addCase(updatePlacesInHall.pending, (state, action) => {
                state.loadingHalls = true;
            });
            builder.addCase(updatePlacesInHall.fulfilled, (state, action) => {
                console.log("updatePlacesInHall fulfilled  action", action.payload);
                state.loadingHalls = false;
            });
            builder.addCase(updatePlacesInHall.rejected, (state, action) => {
                state.error = "Проблема на стороне сервера";
                console.log("updatePlacesInHall rejected  action", action.payload);
                state.loadingHalls = false;
            });
        },
    })
;


export const {
    addFilmToHall,
    changeSelectedHall,
    updateCustomRows,
    updateCustomPlaces,
    updatePrice,
    changePlaceStatus,
} = hallsSlice.actions;
export const {
    halls,
    loadingSeances, chairsUpdateHall,
    pricesUpdateHall, loadingHalls
} = hallsSlice.selectors;
const hallsReducer = hallsSlice.reducer;
export default hallsReducer;


/*


/admin/api/crud/halls - base url

create
POST /admin/api/crud/halls/ body: json { "name": "hall1", ... } - create new hall

receive
GET /admin/api/crud/halls/ - [ {}, {}, {} ] - get all halls
GET /admin/api/crud/halls/hall1 - { "name": "hall1", ... } - get one hall

update
PUT /admin/api/crud/halls/hall1 body: json { "name": "hall1", ... } - update one hall

delete
DELETE /admin/api/crud/halls/hall1 - delete one hall


 */