import {combineReducers, configureStore} from "@reduxjs/toolkit";
import filmsReducer from "./slices/films.js";

const rootReducer = combineReducers({
    films:filmsReducer,
});

export const store = configureStore({
    reducer: rootReducer,
})

