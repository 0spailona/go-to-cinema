import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
//import {createMovie, createSeance} from "../../js/modelUtils.js";
import {fetchToken, getObjMovies} from "../utils.js";

//const basedUrl = import.meta.env.VITE_URL
//const basedUrl = "import.meta.env.VITE_URL";
//192.168.23.15:3002
//const basedUrl = import.meta.env.VITE_URL; //http://127.0.0.1:8000/admin/
const basedUrl = "admin/";
//console.log("basedUrl", basedUrl);
const token = await fetchToken();



export const fetchMovies = createAsyncThunk(
    "fetchMovies",
    async () => {
        const response = await fetch(`${basedUrl}api/moviesList`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);

export const fetchNewMovie = createAsyncThunk(
    "fetchNewMovie",
    async (data) => {
        const response = await fetch(`${basedUrl}api/newMovie`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "text/plain",
                "X-CSRF-TOKEN": token,
            },
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(data),
        });
        return response.json();
    }
);

export const removeMovieFromList = createAsyncThunk(
    "removeMovieFromList",
    async (id) => {
        console.log("removeMovieFromList",id);
        const response = await fetch(`${basedUrl}api/removeMovie?id=${id}`, {
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": token,
            },
            method: "POST",
            credentials: "same-origin",
        });
        return response.json();
    }
);



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
    },
    extraReducers:
        builder => {
            // get all movies
            builder.addCase(fetchMovies.pending, (state, action) => {
                state.loadingMovies = true;
            });
            builder.addCase(fetchMovies.fulfilled, (state, action) => {
                //console.log("fetchMovies fulfilled action", action.payload);
                state.movies = getObjMovies(action.payload.data);
                state.loadingMovies = false;
            });
            builder.addCase(fetchMovies.rejected, (state, action) => {
                state.loadingMovies = false;
                state.error = "Проблема на стороне сервера";
                console.log("fetchMovies rejected action", action.payload);
            });

            // create new movie
            builder.addCase(fetchNewMovie.pending, (state, action) => {
                state.loadingMovies = true;
            });
            builder.addCase(fetchNewMovie.fulfilled, (state, action) => {
                console.log("fetchNewMovie fulfilled action", action.payload);
                state.loadingMovies = false;
            });
            builder.addCase(fetchNewMovie.rejected, (state, action) => {
                state.loadingMovies = false;
                state.error = "Проблема на стороне сервера";
                console.log("fetchNewMovie rejected action", action.payload);
            });

            // remove movie from list
            builder.addCase(removeMovieFromList.pending, (state, action) => {
                state.loadingMovies = true;
            });
            builder.addCase(removeMovieFromList.fulfilled, (state, action) => {
                console.log("removeMovieFromList fulfilled action", action.payload);
                state.loadingMovies = false;
            });
            builder.addCase(removeMovieFromList.rejected, (state, action) => {
                state.loadingMovies = false;
                state.error = "Проблема на стороне сервера";
                console.log("removeMovieFromList rejected action", action.payload);
            });

        },
});

export const {
    //fetchUpdatesSeances,
    //addMovieToSeancesHall, resetUpdatesSeances,
    //removeMovie, removeMovieFromSeanceHall, resetUpdateSeancesByDate, getMoviesByDate
} = moviesSlice.actions;
export const {
    movies,
    loadingMovies,
    //seances,
    //isUpdatedSeances,
    //chosenDate
    poster
} = moviesSlice.selectors;
const moviesReducer = moviesSlice.reducer;
export default moviesReducer;