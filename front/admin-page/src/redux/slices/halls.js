import {createSlice} from "@reduxjs/toolkit";
import {placesType} from "../../js/info.js";
import {fillPlacesByStandard} from "../../js/modelUtils.js";


const initialState = {
    loadingHalls: true,
    halls: null,
    canUpdate: false,
    hallConfig: {
        hallNameLength: {min: 2, max: 15}, rowsCount: {min: 6, max: 20}, placesInRow: {min: 6, max: 20},
        maxPrice: 1000, minVipPrice: 360, minStandardPrice: 20
    },
    hallToUpdateConfig: {hallId: null, isUpdated: false}
};

const hallsSlice = createSlice({
        name: "halls",
        initialState,
        selectors: {
            halls: (state => state.halls),
            hallsId: (state => state.hallsId),
            loadingHalls: (state => state.loadingHalls),
            hallConfig: (state) => state.hallConfig,
            canUpdate: (state) => state.canUpdate,
            hallToUpdateConfig: (state) => state.hallToUpdateConfig,
        },
        reducers: {
            setHallToUpdateConfig: (state, action) => {
                state.hallToUpdateConfig.hallId = action.payload.hallId;
                state.hallConfig.isUpdated = action.payload.isUpdated;
            },
            setCanUpdate: (state, action) => {
                state.canUpdate = action.payload;
            },
            updateCustomRows: (state, action) => {

                const newRowCount = action.payload.rows;
                const hall = state.halls[action.payload.hallId];
                const oldRowCount = hall.rowsCount;
                const difference = newRowCount - oldRowCount;

                hall.places = difference < 0 ? hall.places.splice(0, newRowCount) :
                    difference > 0 ? fillPlacesByStandard(hall.places, difference, hall.placesInRow) : hall.places;

                hall.rowsCount = newRowCount;

            },
            updateCustomPlaces: (state, action) => {

                const newPlacesInRow = action.payload.places;
                const hall = state.halls[action.payload.hallId];
                const oldPlacesInRow = hall.placesInRow;
                const difference = newPlacesInRow - oldPlacesInRow;
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
                    hall.placesInRow = newPlacesInRow;
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

                const rowIndex = action.payload.rowIndex;
                const placeIndex = action.payload.placeIndex;
                state.halls[action.payload.hallId].places[rowIndex][placeIndex] = action.payload.newStatus;
            },
            setHalls: (state, action) => {
                state.halls = action.payload;
            },
            setLoadingHalls: (state, action) => {
                state.loadingHalls = action.payload;
            },
            setConfig: (state, action) => {
                state.hallConfig = action.payload;
            },
        },

    })
;


export const {
    setHallToUpdateConfig,
    setCanUpdate,
    updateCustomRows,
    updateCustomPlaces,
    updateStandardPrice,
    updateVipPrice,
    changePlaceStatus,
    setHalls,
    setLoadingHalls,
    setConfig,
} = hallsSlice.actions;
export const {
    canUpdate,
    halls,
    pricesUpdateHall,
    loadingHalls,
    hallConfig
} = hallsSlice.selectors;
const hallsReducer = hallsSlice.reducer;
export default hallsReducer;

