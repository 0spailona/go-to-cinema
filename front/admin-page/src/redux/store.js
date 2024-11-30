import {combineReducers, configureStore} from "@reduxjs/toolkit";
import filmsReducer from "./slices/films.js";
import hallsReducer from "./slices/halls.js";
import {listenerMiddleware} from "./listenerMiddleware.js";

const rootReducer = combineReducers({
    films:filmsReducer,
    halls:hallsReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

