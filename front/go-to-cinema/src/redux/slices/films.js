import {createSlice} from "@reduxjs/toolkit";
import {sendDataToServer} from "../utils.js";

//const basedUrl = import.meta.env.VITE_URL
const basedUrl = "import.meta.env.VITE_URL";

const initialState = {
    loadingFilms: true,
    error: "",
    films: [{
        id: "m-1",
        title: "Звёздные войны XXIII: Атака клонированных клонов",
        time: "130 минут",
        poster: "i/poster.png"
    },
        {id: "m-2", title: "Миссия выполнима", time: "120 минут", poster: "i/poster.png"},
        {id: "m-3", title: "Серая пантера", time: "90 минут", poster: "i/poster.png"},
        {id: "m-4", title: "Движение вбок", time: "95 минут", poster: "i/poster.png"},
        {id: "m-5", title: "Кот Да Винчи", time: "100 минут", poster: "i/poster.png"}],
    filmsId: ["m-1", "m-2", "m-3", "m-4", "m-5"]
};


export const filmsSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        films: (state => state.films),
        filmsId: (state => state.filmsId),
        loadingFilms: (state => state.loadingFilms)
    },
    reducers: (create) => ({
        /*fetchFilms: create.asyncThunk(
            async (pattern, api) => {
                try {
                    const fullUrl = `${basedUrl}${pattern}`;
                    //const response = await fetch(fullUrl, {method: "GET", mode: "no-cors"})
                    const response = await fetch(fullUrl);
                    if (Math.floor(response.status / 100) !== 2) {
                        return api.rejectWithValue(`Loading error ${response.statusText}`);
                    }
                    return await response.json();
                } catch (e) {
                    return api.rejectWithValue(e);
                }
            },
            {
                pending: (state) => {
                    state.loadingFilms = true;
                    state.error = "";
                    state.films = [];
                },
                fulfilled: (state, action) => {
                    state.films = action.payload;
                    state.error = "";
                },
                rejected: (state, action) => {
                    state.error = "Loading films error";
                    console.log("error fetchFilms");
                },
                settled: (state) => {
                    state.loadingFilms = false;
                }
            }
        ),
        addNewFilm: create.asyncThunk(async (pattern, api) => {
                try {
                    const answer = await sendDataToServer({data:pattern, userType:"admin",dataType:"film"})

                    if (answer.status === 500) {
                        return api.rejectWithValue("Сервер недоступен")
                    }

                    if (Math.floor(answer.status / 100) !== 2) {
                        return api.rejectWithValue(answer.statusText)
                    }
                    return true

                } catch (e) {
                    return api.rejectWithValue(e)
                }
            },
                {
                    pending: (state) => {
                        state.error = ""
                        state.success = false
                    },
                    fulfilled: (state) => {
                        state.success = true
                        state.errors = ""
                    },
                    rejected: (state, action) => {
                        state.errors = action.payload
                    },
                    settled: (state) => {
                        state.success = false
                    }
                }
        ),*/
    }),
});

export const {fetchFilms, addNewFilm} = filmsSlice.actions
export const {films,
    filmsId,
    loadingFilms} = filmsSlice.selectors
const filmsReducer = filmsSlice.reducer
export default filmsReducer