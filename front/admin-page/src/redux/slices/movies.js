import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    loadingMovies: false,
    error: "",
    movies: null,
    poster:null,
};


export const moviesSlice = createSlice({
    name: "movies",
    initialState,
    selectors: {
        movies: (state => state.movies),
        loadingMovies: (state => state.loadingMovies),
        poster: (state => state.poster),
    },
    reducers: {
        setMovies: (state, action) => {
            state.movies = action.payload;
        },
        setLoadingMovies: (state, action) => {
            state.loadingMovies = action.payload;
        }
    },
});

export const {
    setLoadingMovies,
    setMovies,
} = moviesSlice.actions;
export const {
    movies,
    loadingMovies,
    poster
} = moviesSlice.selectors;
const moviesReducer = moviesSlice.reducer;
export default moviesReducer;