//const basedUrl = import.meta.env.VITE_URL
import {createSlice} from "@reduxjs/toolkit";
import {placesType} from "../../admin/info.js";
import {createHall} from "../../admin/modelUtils.js";

const basedUrl = "import.meta.env.VITE_URL";



const initialState = {
    loadingSeances: true,
    error: "",
    halls: {
        "h-1": createHall("h-1", "Зал 1", "standart"),
        "h-2": createHall("h-2", "Зал 2", "standart"),
    },
    chairsUpdateHall: "h-1",
    pricesUpdateHall: "h-1",
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
        addFilmToHall: (state, action) => {
            const newFilm = action.payload.movie;
            state.halls[action.payload.hallId].movies.push(newFilm);
        },
        changeSelectedHall: (state, action) => {
            if (action.payload.name === "chairs-hall") {
                state.chairsUpdateHall = action.payload.hallId;
            }
            if (action.payload.name === "prices-hall") {
                state.pricesUpdateHall = action.payload.hallId;
            }
        },
        updateCustomRows: (state, action) => {
            console.log("slice halls update rows");
            state.halls[action.payload.hallId].custom.rowCount = action.payload.rows;
        },
        updateCustomPlaces: (state, action) => {
            console.log("slice halls update places");
            state.halls[action.payload.hallId].custom.placesInRow = action.payload.places;
        },
        updatePrice: (state, action) => {
            if(action.payload.type === placesType.vip){
                console.log("slice halls update vip Price");
                state.halls[action.payload.hallId].custom.price.vip = action.payload.price;
            }
            else {
                console.log("slice halls update standart Price");
                state.halls[action.payload.hallId].custom.price.standart = action.payload.price;
            }
        },
        onPlaceChange:(state, action) => {

        }
    }
});


export const {
    addFilmToHall,
    changeSelectedHall,
    updateCustomRows,
    updateCustomPlaces,
    updatePrice
} = hallsSlice.actions;
export const {
    halls,
    hallsId,
    loadingSeances, chairsUpdateHall,
    pricesUpdateHall
} = hallsSlice.selectors;
const hallsReducer = hallsSlice.reducer;
export default hallsReducer;