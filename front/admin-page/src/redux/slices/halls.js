//const basedUrl = import.meta.env.VITE_URL
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {placesType} from "../../js/info.js";
import {fillPlacesByStandard} from "../../js/modelUtils.js";
import {fetchToken, getHallsObj, getPlacesObj} from "../utils.js";
//192.168.23.15:3002
//const basedUrl = import.meta.env.VITE_URL; //http://127.0.0.1:8000/admin/
const basedUrl = "admin/";
//console.log("basedUrl", basedUrl);
const token = await fetchToken();
//console.log("fetchToken",await fetchToken());

//const tokenHalls = token;

export const fetchHalls = createAsyncThunk(
    "fetchHalls",
    async () => {
        const response = await fetch(`${basedUrl}api/hallsList`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);

export const fetchHallConfig = createAsyncThunk(
    "fetchHallConfig",
    async () => {
        const response = await fetch(`${basedUrl}api/hallConfig`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);

export const fetchHallByName = createAsyncThunk(
    "fetchHallByName",
    async (name) => {
        console.log("fetchHallByName", name);
        const response = await fetch(`${basedUrl}api/hall/${name}`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);

export const fetchNewHall = createAsyncThunk(
    "fetchNewHall",
    async (name) => {
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
        //console.log("updatePlacesInHall request hall", hall);
        const places = getPlacesObj(hall.places);
        const body = JSON.stringify({
            name: hall.name,
            places,
            rowCount: hall.rowCount,
            placesInRow: hall.placeInRowCount
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
        return response.json();
    }
);

export const updatePricesInHall = createAsyncThunk(
    "updatePricesInHall",
    async (hall) => {
        //console.log("updatePricesInHall request hall", hall);
        const body = JSON.stringify({
            name: hall.name,
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
        return response.json();
    }
);

const initialState = {
    loadingSeances: true,
    loadingHalls: true,
    error: "",
    halls: null,
    hallConfig: {
        hallNameLength: {min: 2, max: 15}, rowsCount: {min: 6, max: 20}, placesInRow: {min: 6, max: 20},
        maxPrice: 1000, minVipPrice: 360, minStandardPrice: 20
    },
};

const hallsSlice = createSlice({
        name: "halls",
        initialState,
        selectors: {
            halls: (state => state.halls),
            hallsId: (state => state.hallsId),
            loadingSeances: (state => state.loadingSeances),
            loadingHalls: (state => state.loadingHalls),
            hallConfig: (state) => state.hallConfig,
        },
        reducers: {
            updateCustomRows: (state, action) => {
                console.log("slice halls update rows");
                const newRowCount = action.payload.rows;
                const hall = state.halls[action.payload.hallId];
                const oldRowCount = hall.rowCount;
                const difference = newRowCount - oldRowCount;

                hall.places = difference < 0 ? hall.places.splice(0, newRowCount) :
                    difference > 0 ? fillPlacesByStandard(hall.places, difference, hall.placeInRowCount) : hall.places;

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
                    hall.placeInRowCount = newPlacesInRow;
                }
            },
            updateVipPrice: (state, action) => {
                const newPrice = action.payload.price;
                const hall = state.halls[action.payload.hallId];
                hall.prices.vip = newPrice;
            },
            updateStandardPrice: (state, action) => {
                const newPrice = action.payload.price;
                const hall = state.halls[action.payload.hallId];
                hall.prices.standard = newPrice;
            },
            changePlaceStatus: (state, action) => {
                console.log("slice halls change PlaceStatus");
                const rowIndex = action.payload.rowIndex;
                const placeIndex = action.payload.placeIndex;
                state.halls[action.payload.hallName].places[rowIndex][placeIndex] = action.payload.newStatus;
            }
        },
        extraReducers:
            builder => {
                // get hall config
                builder.addCase(fetchHallConfig.pending, (state, action) => {
                });
                builder.addCase(fetchHallConfig.fulfilled, (state, action) => {
                    state.hallConfig = action.payload.hallConfig;

                });
                builder.addCase(fetchHallConfig.rejected, (state, action) => {
                    state.error = "Проблема на стороне сервера";
                    console.log("fetchHalls rejected action", action.payload);
                });


                // get all halls
                builder.addCase(fetchHalls.pending, (state, action) => {
                    state.loadingHalls = true;
                });
                builder.addCase(fetchHalls.fulfilled, (state, action) => {
                    const hallsArr = action.payload.data;
                    state.halls = getHallsObj(hallsArr);
                    state.loadingHalls = false;
                });
                builder.addCase(fetchHalls.rejected, (state, action) => {
                    state.loadingHalls = false;
                    state.error = "Проблема на стороне сервера";
                    console.log("fetchHalls rejected action", action.payload);
                });

                // get hall by name
                builder.addCase(fetchHallByName.pending, (state, action) => {
                    state.loadingHalls = true;
                });
                builder.addCase(fetchHallByName.fulfilled, (state, action) => {
                    // console.log("fetchHallByName.fulfilled", action.payload);
                    const hallFullData = action.payload.data;
                    const hall = getHallsObj([hallFullData])[hallFullData.name];
                    state.halls[hallFullData.name] = hall;
                    // console.log("fetchHallByName hall", hall);

                    state.loadingHalls = false;
                });
                builder.addCase(fetchHallByName.rejected, (state, action) => {
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

                // update prices in hall
                builder.addCase(updatePricesInHall.pending, (state, action) => {
                    state.loadingHalls = true;
                });
                builder.addCase(updatePricesInHall.fulfilled, (state, action) => {
                    console.log("updatePricesInHall fulfilled  action", action.payload);
                    state.loadingHalls = false;
                });
                builder.addCase(updatePricesInHall.rejected, (state, action) => {
                    state.error = "Проблема на стороне сервера";
                    console.log("updatePlacesInHall rejected  action", action.payload);
                    state.loadingHalls = false;
                });
            },
    })
;


export const {
    addFilmToHall,
    updateCustomRows,
    updateCustomPlaces,
    updateStandardPrice,
    updateVipPrice,
    changePlaceStatus,
} = hallsSlice.actions;
export const {
    halls,
    loadingSeances,
    pricesUpdateHall,
    loadingHalls,
    hallConfig
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