import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createFilm, createSeance} from "../../js/modelUtils.js";
import {fetchToken, getObjMovies, getSeancesObj} from "../utils.js";
//import {createSeance} from "../../js/modelUtils.js";
import {fetchMovies, fetchNewMovie, removeMovieFromList} from "./films.js";

const basedUrl = "admin/";
//console.log("basedUrl", basedUrl);
const token = await fetchToken();

const startFilms = [createFilm("Звёздные войны XXIII: Атака клонированных клонов", 130, "description", "country", null),
    createFilm("Миссия выполнима", 120, "description", "country", null),
    createFilm("Серая пантера", 90, "description", "country", null),
    createFilm("Движение вбок", 95, "description", "country", null),
    createFilm("Кот Да Винчи", 100, "description", "country", null)];

const createSeanceDay = () => {
    const halls = ["h-1", "h-2"];
    const day = {};

    for (let hall of halls) {
        day[hall] = [];
    }
    return day;
};

export const getSeancesByDate = createAsyncThunk(
    "getSeancesByDate",
    async (date) => {
        const response = await fetch(`${basedUrl}api/seancesListByDate?date=${date}`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);


const initialState = {
    loadingSeances: false,
    error: "",
    seances: {},
   // chosenDate: null,
    isUpdatedSeances: false,
};

export const seancesSlice = createSlice({
    name: "seances",
    initialState,
    selectors: {
        //films: (state => state.films),
        loadingSeances: (state => state.loadingSeances),
        seances: (state => state.seances),
        //chosenDate: state => state.chosenDate,
        isUpdatedSeances: state => state.isUpdatedSeances,
    },
    reducers: {
        addFilmToSeancesHall: (state, action) => {
            state.isUpdatedSeances = true;
            console.log("addNewFilmToSeancesHall", action.payload);
            const hallId = action.payload.to;
            const fromHallId = action.payload.from;
            const filmId = action.payload.filmId;
            const start = action.payload.start;
            //console.log("addFilmToSeancesHall", action.payload.from, action.payload.to, action.payload.filmId,action.payload.filmIndex, action.payload.start);
            const newSeance = createSeance(filmId, start);
            state.seances[state.chosenDate][hallId].push(newSeance);

            if (fromHallId) {
                state.seances[state.chosenDate][fromHallId].splice(action.payload.filmIndex, 1);
            }
        },
        removeFilmFromSeanceHall: (state, action) => {
            state.isUpdatedSeances = true;
            console.log("removeFilmFromSeanceHall", action.payload);
            const fromHallId = action.payload.hallId;
            const filmIndex = action.payload.filmIndex;
            state.seances[state.chosenDate][fromHallId].splice(filmIndex, 1);
        },
        resetUpdatesSeances: (state, action) => {
            state.isUpdatedSeances = false;
            console.log("resetUpdatesSeances");
        },
        fetchUpdatesSeances: (state, action) => {
            state.isUpdatedSeances = false;
            console.log("fetchUpdatesSeances");
        },
        /*getFilmsByDate: (state, action) => {
            state.isUpdatedSeances = false;
            state.chosenDate = action.payload;
            console.log("getFilmsByDate");
            if (!state.seances[action.payload]) {
                state.seances[action.payload] = createSeanceDay();
            }
        },*/
        resetUpdateSeancesByDate: (state, action) => {
            state.isUpdatedSeances = false;
            delete state.seances[action.payload];
            console.log("resetUpdateSeances");
        },
    },
    extraReducers:
        builder => {
            // get seances by date
            builder.addCase(getSeancesByDate.pending, (state, action) => {
                state.loadingSeances = true;
            });
            builder.addCase(getSeancesByDate.fulfilled, (state, action) => {
                //console.log("getSeancesByDate fulfilled action", action.payload);
                //const halls = action.payload.halls;
                state.seances = getSeancesObj(action.payload.halls, action.payload.seances);
                //state.chosenDate = (action.payload.date)
                //state.films = getObjMovies(action.payload.data);
                //state.seances = action.payload.seances;
                state.loadingSeances = false;
            });
            builder.addCase(getSeancesByDate.rejected, (state, action) => {
                state.loadingSeances = false;
                state.error = "Проблема на стороне сервера";
                console.log("getSeancesByDate rejected action", action.payload);
            });
        },
});

export const {
    fetchUpdatesSeances,
    addFilmToSeancesHall, resetUpdatesSeances,
    removeFilm, removeFilmFromSeanceHall, resetUpdateSeancesByDate,
} = seancesSlice.actions;
export const {
    films,
    loadingFilms,
    seances,
    isUpdatedSeances,
    //chosenDate
} = seancesSlice.selectors;
const seancesReducer = seancesSlice.reducer;
export default seancesReducer;
