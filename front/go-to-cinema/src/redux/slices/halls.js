//const basedUrl = import.meta.env.VITE_URL
import {createSlice} from "@reduxjs/toolkit";

const basedUrl = "import.meta.env.VITE_URL";

const disabled = [{row: 1, place: 1}, {row: 1, place: 2}, {row: 1, place: 3},
    {row: 1, place: 6}, {row: 1, place: 7}, {row: 1, place: 8},
    {row: 2, place: 1}, {row: 2, place: 2}, {row: 2, place: 7}, {row: 2, place: 8},
    {row: 3, place: 1}, {row: 3, place: 8},
    {row: 4, place: 8}, {row: 5, place: 8}, {row: 6, place: 8}, {row: 7, place: 8}, {
        row: 8,
        place: 8
    },];

const vip = [{row: 4, place: 4}, {row: 4, place: 5},
    {row: 5, place: 3}, {row: 5, place: 4}, {row: 5, place: 5}, {row: 5, place: 6},
    {row: 6, place: 3}, {row: 6, place: 4}, {row: 6, place: 5}, {row: 6, place: 6},
    {row: 7, place: 3}, {row: 7, place: 4}, {row: 7, place: 5}, {row: 7, place: 6},];

const hallType = {
    "standart": {
        rows: 10,
        placesInRow: 8,
        disabled: disabled,
        vip: vip,
    }
};


const initialState = {
    loadingSeances: true,
    error: "",
    halls: {
        "h-1": {
            id: "h-1",
            name: "Зал 1",
            movies: [],
            type: hallType.standart,
            custom: {
                rowCount: 0, placesInRow: 8, disabled: [],
                vip: []
            },

        },
        "h-2": {
            id: "h-2",
            name: "Зал 2",
            movies: [],
            type: hallType.standart,
            custom: {
                rowCount: 0, placesInRow: 8, disabled: [],
                vip: []
            },

        }
    },
    hallsId: ["h-1", "h-2"],
    chairsUpdateHall: "h-1",
    pricesUpdateHall: "h-1",
};

const hallsSlice = createSlice({
    name: "halls",
    initialState,
    selectors: {
        halls: (state => state.halls),
        hallsId: (state => state.hallsId),
        loadingSeances: (state => state.loadingSeances),
        chairsUpdateHall: (state => state.chairsUpdateHall),
        pricesUpdateHall: (state => state.pricesUpdateHall),
    },
    reducers: {
        addFilmToHall: (state, action) => {
            const newFilm = action.payload.movie;
            state.halls[action.payload.hallId].movies.push(newFilm);
        },
        changeSelectedHall: (state, action) => {
            if (action.payload.name === "chairs-hall") {
                state.chairsUpdateHall = action.payload.hallId;
            }
            if (action.payload.name === "prices-hall") {
                state.pricesUpdateHall = action.payload.hallId;
            }
        },
        updateCustomRows: (state, action) => {
            console.log("slice halls update");
            state.halls[action.payload.hallId].custom = action.payload.rows;
        },
    }
});


export const {addFilmToHall, changeSelectedHall, updateCustomRows} = hallsSlice.actions;
export const {
    halls,
    hallsId,
    loadingSeances, chairsUpdateHall
} = hallsSlice.selectors;
const hallsReducer = hallsSlice.reducer;
export default hallsReducer;