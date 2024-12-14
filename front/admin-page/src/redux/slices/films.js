import {createSlice} from "@reduxjs/toolkit";
import {createFilm, createSeance} from "../../js/modelUtils.js";

//const basedUrl = import.meta.env.VITE_URL
const basedUrl = "import.meta.env.VITE_URL";

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

const initialState = {
    loadingFilms: false,
    error: "",
    films: {},
    seances: {},
    chosenDate: null,
    isUpdatedSeances: false,
};

for (let film of startFilms) {
    initialState.films[film.id] = film;
}


export const filmsSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        films: (state => state.films),
        loadingFilms: (state => state.loadingFilms),
        seances: (state => state.seances),
        chosenDate: state => state.chosenDate,
        isUpdatedSeances: state => state.isUpdatedSeances,
    },
    reducers: {
        addNewFilm: (state, action) => {
            const {title, time, poster, country, description} = action.payload;
            console.log("addNewFilm", title, time, poster, country, description);
            for (let film of Object.values(state.films)) {
                if (film.title === title && film.country === country && film.description === description) {
                    console.log("Error. Such film is in base");
                    return;
                }
            }
            const newFilm = createFilm(title, time, description, country, poster);
            state.films[newFilm.id] = newFilm;
        },
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
        removeFilm: (state, action) => {
            console.log("removeFilm", action.payload);
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
        getFilmsByDate: (state, action) => {
            state.isUpdatedSeances = false;
            state.chosenDate = action.payload;
            console.log("getFilmsByDate");
            if (!state.seances[action.payload]) {
                state.seances[action.payload] = createSeanceDay();
            }
        },
        resetUpdateSeancesByDate: (state, action) => {
            state.isUpdatedSeances = false;
            delete state.seances[action.payload];
            console.log("resetUpdateSeances");
        },
    }
});

export const {
    addNewFilm, fetchUpdatesSeances,
    addFilmToSeancesHall, resetUpdatesSeances,
    removeFilm, removeFilmFromSeanceHall, resetUpdateSeancesByDate, getFilmsByDate
} = filmsSlice.actions;
export const {
    films,
    loadingFilms,
    seances,
    isUpdatedSeances,
    chosenDate
} = filmsSlice.selectors;
const filmsReducer = filmsSlice.reducer;
export default filmsReducer;