import {createSlice} from "@reduxjs/toolkit";
import {createFilm} from "../../js/modelUtils.js";

//const basedUrl = import.meta.env.VITE_URL
const basedUrl = "import.meta.env.VITE_URL";

const startFilms = [createFilm("Звёздные войны XXIII: Атака клонированных клонов",
    130,
    "description", "country", null,
    {
        "hall-1": [{hours: "00", min: "00"}, {hours: "00", min: "00"}],
        "hall-2": [{hours: "00", min: "00"}]
    }),
    createFilm("Миссия выполнима", 120, "description", "country", null,
        {
            "hall-1": [{hours: "00", min: "00"}, {hours: "00", min: "00"}],
            "hall-2": [{hours: "00", min: "00"}]
        }),
    createFilm("Серая пантера", 90, "description", "country", null,
        {
            "hall-1": [{hours: "00", min: "00"}, {hours: "00", min: "00"}],
            "hall-2": [{hours: "00", min: "00"}]
        }),
    createFilm("Движение вбок", 95, "description", "country", null,
        {
            "hall-1": [{hours: "00", min: "00"}, {hours: "00", min: "00"}],
            "hall-2": [{hours: "00", min: "00"}]
        }),
    createFilm("Кот Да Винчи", 100, "description", "country", null,
        {
            "hall-1": [{hours: "00", min: "00"}, {hours: "00", min: "00"}],
            "hall-2": [{hours: "00", min: "00"}]
        }),];


const initialState = {
    loadingFilms: true,
    error: "",
    films: {},
    halls:{}
};

for (let film of startFilms) {
    initialState.films[film.id] = film;
}

export const filmsSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        films: (state => state.films),
        halls: (state) => state.halls,
        loadingFilms: (state => state.loadingFilms)
    },
    reducers: {}
});

export const {addNewFilm, addFilmToSeancesHall} = filmsSlice.actions;
export const {
    films,
    loadingFilms,halls
} = filmsSlice.selectors;
const filmsReducer = filmsSlice.reducer;
export default filmsReducer;