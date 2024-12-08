import {createSlice} from "@reduxjs/toolkit";
import {createFilm} from "../../js/modelUtils.js";

//const basedUrl = import.meta.env.VITE_URL
const basedUrl = "import.meta.env.VITE_URL";

const startFilms = [createFilm("Звёздные войны XXIII: Атака клонированных клонов", 130, "description", "country", null),
    createFilm("Миссия выполнима", 120, "description", "country", null),
    createFilm("Серая пантера", 90, "description", "country", null),
    createFilm("Движение вбок", 95, "description", "country", null),
    createFilm("Кот Да Винчи", 100, "description", "country", null)];


const initialState = {
    loadingFilms: true,
    error: "",
    films: {}
};

for (let film of startFilms) {
    initialState.films[film.id] = film;
}


export const filmsSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        films: (state => state.films),
        loadingFilms: (state => state.loadingFilms)
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
            console.log("addFilmToSeancesHall", action.payload.from, action.payload.to, action.payload.film);
        },
        removeFilm: (state, action) => {
            console.log("removeFilm", action.payload);
        },

    }
});

export const {addNewFilm, addFilmToSeancesHall} = filmsSlice.actions;
export const {
    films,
    loadingFilms
} = filmsSlice.selectors;
const filmsReducer = filmsSlice.reducer;
export default filmsReducer;