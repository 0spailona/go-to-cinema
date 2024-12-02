import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cinemaReducer from "./slices/cinema.js";

const rootReducer = combineReducers({
    cinema:cinemaReducer,
});

export const store = configureStore({
    reducer: rootReducer,
})

