import {createSlice} from "@reduxjs/toolkit";
import {startFilms, startHalls} from "../hardcode.js";
import {createFilm} from "../../js/modelUtils.js";

//const basedUrl = import.meta.env.VITE_URL
const basedUrl = "import.meta.env.VITE_URL";


const initialState = {
    loadingFilms: true,
    error: "",
    films: {},
    halls:{},
    chosenDate: new Date().toISOString(),
    chosenSeance:null,
};

for (let film of startFilms) {
    initialState.films[film.id] = film;
}

for (let hall of startHalls) {
    initialState.halls[hall.id] = hall;
}

export const cinemaSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        films: (state => state.films),
        halls: (state) => state.halls,
        loadingFilms: (state => state.loadingFilms),
        chosenDate: state => state.chosenDate,
        chosenSeance: state => state.chosenSeance,
    },
    reducers: {
        getFilmsByDate: (state, action) => {

            console.log("getFilmsByDate weekday", action.payload);
            //const date = JSON.parse(action.payload);
            //console.log("getFilmsByDate date", date);
        },
        changeChosenDate: (state, action) => {
            state.chosenDate = action.payload;
        },
        changeChosenSeance: (state, action) => {
            console.log("changeChosenSeance", action.payload)
            state.chosenSeance = {hallId:action.payload.hallId, filmId:action.payload.filmId,time:action.payload.time};
        },
        changePlaceStatus: (state, action) => {
            console.log("slice halls change PlaceStatus");
            const rowIndex = action.payload.rowIndex;
            const placeIndex = action.payload.placeIndex;
            state.halls[action.payload.hallId].places[rowIndex][placeIndex] = action.payload.newStatus;
        }
    }
});

export const {getFilmsByDate,
    changePlaceStatus,changeChosenDate,changeChosenSeance} = cinemaSlice.actions;
export const {
    films,
    loadingFilms,halls,
    chosenDate,chosenSeance,
} = cinemaSlice.selectors;
const cinemaReducer = cinemaSlice.reducer;
export default cinemaReducer;