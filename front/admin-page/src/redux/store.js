import {combineReducers, configureStore} from "@reduxjs/toolkit";
import filmsReducer from "./slices/films.js";
import hallsReducer from "./slices/halls.js";
import {listenerMiddleware} from "./listenerMiddleware.js";
import seancesReducer from "./slices/seances.js";

const rootReducer = combineReducers({
    films:filmsReducer,
    halls:hallsReducer,
    seances:seancesReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

