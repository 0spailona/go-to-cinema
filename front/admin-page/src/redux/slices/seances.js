import {createSlice} from "@reduxjs/toolkit";
import {createSeance} from "../utils.js";


const initialState = {
    loadingSeances: false,
    seances: null,
};

export const seancesSlice = createSlice({
    name: "seances",
    initialState,
    selectors: {
        loadingSeances: (state => state.loadingSeances),
        seances: (state => state.seances),
        isUpdatedSeances: state => state.isUpdatedSeances,
    },
    reducers: {
        addMovieToSeancesHall: (state, action) => {
            const hallId = action.payload.to;
            const fromHallId = action.payload.from;
            const movieId = action.payload.movieId;
            const start = action.payload.start;
            if (fromHallId) {
                state.seances[fromHallId].seances = state.seances[fromHallId].seances.filter(seance => seance.id !== action.payload.seanceId);
            }
            const newSeance = createSeance(movieId,hallId, start);
            state.seances[hallId].seances.push(newSeance);
        },
        removeMovieFromSeanceHall: (state, action) => {
            const fromHallId = action.payload.hallId;
            const seanceId = action.payload.seanceId;
            state.seances[fromHallId].seances = state.seances[fromHallId].seances.filter(seance => seance.id !== seanceId);
        },
        setLoadingSeances: (state, action) => {
            state.loadingSeances = action.payload;
        },
        setSeances: (state, action) => {
            state.seances = action.payload;
        },
    },
});

export const {
    addMovieToSeancesHall,
    setLoadingSeances,
    setSeances,
    removeMovieFromSeanceHall,
} = seancesSlice.actions;
export const {
    seances,
} = seancesSlice.selectors;
const seancesReducer = seancesSlice.reducer;
export default seancesReducer;
