import {combineReducers, configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
   // films:filmsReducer,
});

export const store = configureStore({
    reducer: rootReducer,
})

