import {combineReducers, configureStore} from "@reduxjs/toolkit";
import moviesReducer from "./slices/movies.js";
import hallsReducer from "./slices/halls.js";
import seancesReducer from "./slices/seances.js";
import commonReducer from "./slices/common.js";

const rootReducer = combineReducers({
    movies:moviesReducer,
    halls:hallsReducer,
    seances:seancesReducer,
    common:commonReducer,
});

export const store = configureStore({
    reducer: rootReducer,
})

