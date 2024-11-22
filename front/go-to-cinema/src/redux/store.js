import {combineReducers, configureStore} from "@reduxjs/toolkit";
import filmsReducer from "./slices/films.js";
import hallsReducer from "./slices/halls.js";

const rootReducer = combineReducers({
    //favorites: favoritesReducer,
    films:filmsReducer,
    halls:hallsReducer
});

export const store = configureStore({
    reducer: rootReducer,
})

