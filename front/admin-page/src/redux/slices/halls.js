//const basedUrl = import.meta.env.VITE_URL
import {createSlice} from "@reduxjs/toolkit";
import {placesType, selectedHallType} from "../../js/info.js";
import {createHall, fillPlacesByStandard} from "../../js/modelUtils.js";

const basedUrl = "import.meta.env.VITE_URL";

const hall1 = createHall( "Зал 1", "standard");
const hall2 = createHall( "Зал 2", "standard");


const initialState = {
    loadingSeances: true,
    error: "",
    halls: {
        "h-1": hall1,
        "h-2": hall2,
    },
    chairsUpdateHall: {id: "h-1", isUpdated: false},
    pricesUpdateHall: {id: "h-1", isUpdated: false}
};

const hallsSlice = createSlice({
        name: "halls",
        initialState,
        selectors: {
            halls: (state => state.halls),
            hallsId: (state => state.hallsId),
            loadingSeances: (state => state.loadingSeances),
            chairsUpdateHall: (state => state.chairsUpdateHall),
            pricesUpdateHall: (state => state.pricesUpdateHall),
        },
        reducers: {
            createNewHall: (state, action) => {
                for(let hall of Object.values(state.halls)) {
                    if(hall.name === action.payload) {
                        console.log("Error, such name is occupied!");
                        return
                    }
                }
                const newHall = createHall(action.payload,"standard");
                console.log("newHall", newHall);
                state.halls[newHall.id] = newHall;
            },
            removeHallFromState: (state, action) => {
                delete state.halls[action.payload];
            },
            addFilmToHall: (state, action) => {
                console.log("addFilmToHall", action.payload.from, action.payload.to, action.payload.film);
                state.halls[action.payload.to].movies.push(action.payload.film);
                //const newFilm = action.payload.movie;
                //state.halls[action.payload.hallId].movies.push(newFilm);
            },
            changeSelectedHall: (state, action) => {
                if (action.payload.name === selectedHallType.chairs) {
                    state.chairsUpdateHall = {id: action.payload.hallId, isUpdated: false};
                }
                if (action.payload.name === selectedHallType.prices) {
                    state.pricesUpdateHall = {id: action.payload.hallId, isUpdated: false};
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
                console.log("slice halls change PlaceStatus");
                const rowIndex = action.payload.rowIndex;
                const placeIndex = action.payload.placeIndex;
                state.halls[action.payload.hallId].places[rowIndex][placeIndex] = action.payload.newStatus;
            }
        }
    })
;


export const {
    addFilmToHall,
    changeSelectedHall,
    updateCustomRows,
    updateCustomPlaces,
    updatePrice,
    changePlaceStatus,
    createNewHall,
    removeHallFromState
} = hallsSlice.actions;
export const {
    halls,
    hallsId,
    loadingSeances, chairsUpdateHall,
    pricesUpdateHall
} = hallsSlice.selectors;
const hallsReducer = hallsSlice.reducer;
export default hallsReducer;