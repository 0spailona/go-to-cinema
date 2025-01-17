import {createSlice} from "@reduxjs/toolkit";
import {createSeance} from "../utils.js";


const initialState = {
    loadingSeances: false,
    seances: null,
    isUpdatedSeances: false,
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
            state.isUpdatedSeances = true;
            console.log("addNewMovieToSeancesHall", action.payload);
            const hallId = action.payload.to;
            const fromHallId = action.payload.from;
            const movieId = action.payload.movieId;
            const start = action.payload.start;
            const newSeance = createSeance(movieId, start, state.seances[hallId].seances.length);
            state.seances[hallId].seances.push(newSeance);

            if (fromHallId) {
                state.seances[fromHallId].seances.splice(action.payload.movieIndex, 1);
            }
        },
        removeMovieFromSeanceHall: (state, action) => {
            state.isUpdatedSeances = true;
            console.log("removeMovieFromSeanceHall", action.payload);
            const fromHallId = action.payload.hallId;
            const movieIndex = action.payload.movieIndex;
            state.seances[fromHallId].seances.splice(movieIndex, 1);
        },
        setLoadingSeances: (state, action) => {
            state.loadingSeances = action.payload;
        },
        setSeances: (state, action) => {
            state.seances = action.payload;
        },
        setIsUpdateSeancesFalse: (state, action) => {
            state.isUpdatedSeances = false;
        }
    },
    extraReducers:
        builder => {

        },
});

export const {
    addMovieToSeancesHall,
    setLoadingSeances,
    setSeances,
    removeMovieFromSeanceHall,
    setIsUpdateSeancesFalse
} = seancesSlice.actions;
export const {
    loadingMovies,
    seances,
    isUpdatedSeances,
} = seancesSlice.selectors;
const seancesReducer = seancesSlice.reducer;
export default seancesReducer;
