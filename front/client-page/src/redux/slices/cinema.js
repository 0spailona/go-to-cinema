import {createSlice} from "@reduxjs/toolkit";
import {toISOStringNoMs} from "../../js/utils.js";


const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

const initialState = {
    loading: true,
    error: null,
    movies: {},
    halls: {},
    seances: {},
    chosenDate: toISOStringNoMs(initialDate),
    chosenSeance: {seanceData: null, selectedPlaces: [], takenPlaces: []},
    isDrawPage: false,
    lastIsDrawPage: null,
};


export const cinemaSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        movies: (state => state.movies),
        halls: (state) => state.halls,
        loading: (state => state.loading),
        chosenDate: state => state.chosenDate,
        chosenSeance: state => state.chosenSeance,
        error: state => state.error,
        isDrawPage: state => state.isDrawPage,
        lastIsDrawPage: state => state.lastIsDrawPage,
    },
    reducers: {
        setInitialChosenSeance: (state) => {
            state.chosenDate = toISOStringNoMs(initialDate);
            state.chosenSeance = {seanceData: null, selectedPlaces: [], takenPlaces: []};
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setIsDrawPage: (state, action) => {
            state.lastIsDrawPage = state.isDrawPage;
            state.isDrawPage = action.payload;
        },
        setChosenSeance: (state, action) => {
            state.chosenSeance.takenPlaces = action.payload.takenPlaces;
            state.chosenSeance.seanceData = action.payload.seance;
        },
        setSeances: (state, action) => {
            state.seances = action.payload;
        },
        setHalls: (state, action) => {
            state.halls = action.payload;
        },
        setMovies: (state, action) => {
            state.movies = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        changeChosenDate: (state, action) => {
            state.chosenDate = action.payload;
        },
        changePlaceStatus: (state, action) => {
            const rowIndex = action.payload.rowIndex;
            const placeIndex = action.payload.placeIndex;
            const hallId = state.chosenSeance.seanceData.hallId;
            state.halls[hallId].places[rowIndex][placeIndex] = action.payload.newStatus;
        },
        changeSelectedPlaces: (state, action) => {
            const rowIndex = action.payload.rowIndex;
            const placeIndex = action.payload.placeIndex;
            const lastStatus = action.payload.lastStatus;

            if (action.payload.isSelected) {
                state.chosenSeance.selectedPlaces.push({rowIndex, placeIndex, lastStatus});
            }
            else {
                state.chosenSeance.selectedPlaces = state.chosenSeance.selectedPlaces.filter(place => place.rowIndex !== rowIndex && place.placeIndex !== placeIndex);
            }
        },
    },
});

export const {
    setError,
    setInitialChosenSeance,
    setIsDrawPage,
    setChosenSeance,
    setSeances,
    setHalls,
    setMovies,
    setLoading,
    changePlaceStatus,
    changeChosenDate,
    changeSelectedPlaces,
} = cinemaSlice.actions;
export const {
    error,
    lastIsDrawPage,
    isDrawPage,
    movies,
    loading, halls,
    chosenDate, chosenSeance,
} = cinemaSlice.selectors;
const cinemaReducer = cinemaSlice.reducer;
export default cinemaReducer;