import {createSlice} from "@reduxjs/toolkit";
import {sendDataToServer} from "../utils.js";
import {createFilm, createHall} from "../../js/modelUtils.js";

//const basedUrl = import.meta.env.VITE_URL
const basedUrl = "import.meta.env.VITE_URL";

const initialState = {
    loadingFilms: true,
    error: "",
    films: {"m-1":{
        id: "m-1",
        title: "Звёздные войны XXIII: Атака клонированных клонов",
        time: "130 минут",
        poster: "i/poster.png"
    },
        "m-2": {id: "m-2", title: "Миссия выполнима", time: "120 минут", poster: "i/poster.png"},
        "m-3": {id: "m-3", title: "Серая пантера", time: "90 минут", poster: "i/poster.png"},
        "m-4": {id: "m-4", title: "Движение вбок", time: "95 минут", poster: "i/poster.png"},
        "m-5": {id: "m-5", title: "Кот Да Винчи", time: "100 минут", poster: "i/poster.png"}},
};


export const filmsSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        films: (state => state.films),
        filmsId: (state => state.filmsId),
        loadingFilms: (state => state.loadingFilms)
    },
    reducers: {
        addNewFilm: (state, action) => {
            const {title,time,poster,country,description} = action.payload;
            console.log("addNewFilm",title, time, poster, country, description);
           const newFilm = createFilm(title,time,description,country, poster);
        },
        }
});

export const {fetchFilms, addNewFilm} = filmsSlice.actions
export const {films,
    filmsId,
    loadingFilms} = filmsSlice.selectors
const filmsReducer = filmsSlice.reducer
export default filmsReducer