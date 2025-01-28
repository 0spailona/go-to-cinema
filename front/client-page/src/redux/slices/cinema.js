import {createSlice} from "@reduxjs/toolkit";
import {toISOStringNoMs} from "../../js/utils.js";


const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

const initialState = {
    loading: true,
    error: "",
    movies: {},
    halls: {},
    seances: {},
    chosenDate: toISOStringNoMs(initialDate),
    chosenSeance: {seanceData: null, selectedPlaces: []},
    prices: {standard: 250, vip: 350},
    qr: null,
    ticket: null,
    isDrawPage: false,
    lastIsDrawPage: null,
    bookingId: null,
};


export const cinemaSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        movies: (state => state.movies),
        halls: (state) => state.halls,
        loading: (state => state.loading),
        chosenDate: state => state.chosenDate,
        chosenSeance: state => state.chosenSeance,
        //chosenPlaces: state => state.chosenPlaces,
        prices: state => state.prices,
        qr: state => state.qr,
        isDrawPage: state => state.isDrawPage,
        lastIsDrawPage: state => state.lastIsDrawPage,
        isBooking: state => state.isBooking,
    },
    reducers: {
        setBookingId(state, action) {
            state.bookingId = action.payload;
        },
        setIsDrawPage: (state, action) => {
            state.lastIsDrawPage = state.isDrawPage;
            state.isDrawPage = action.payload;
        },
        setChosenSeance: (state, action) => {
            if (!action.payload) {
                state.chosenSeance.selectedPlaces = [];
            }
            state.chosenSeance.seanceData = action.payload;
        },
        setSeances: (state, action) => {
            state.seances = action.payload;
        },
        setHalls: (state, action) => {
            state.halls = action.payload;
        },
        setMovies: (state, action) => {
            state.movies = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        getFilmsByDate: (state, action) => {

            console.log("getFilmsByDate weekday", action.payload);
            //const date = JSON.parse(action.payload);
            //console.log("getFilmsByDate date", date);
        },
        changeChosenDate: (state, action) => {
            state.chosenDate = action.payload;
        },
        changeChosenSeance: (state, action) => {
            console.log("changeChosenSeance", action.payload);
            //const hall = {...state.halls[action.payload.hallId]};
            //console.log("changeChosenSeance hall", hall)
            state.chosenSeance = action.payload;
        },
        changePlaceStatus: (state, action) => {
            console.log("slice halls change PlaceStatus");
            const rowIndex = action.payload.rowIndex;
            const placeIndex = action.payload.placeIndex;
            const hallId = state.chosenSeance.seanceData.hallId;
            state.halls[hallId].places[rowIndex][placeIndex] = action.payload.newStatus;
        },
        changeSelectedPlaces: (state, action) => {
            const rowIndex = action.payload.rowIndex;
            const placeIndex = action.payload.placeIndex;
            const lastStatus = action.payload.lastStatus;

            if (action.payload.isSelected) {
                state.chosenSeance.selectedPlaces.push({rowIndex, placeIndex, lastStatus});
                //state.chosenPlaces.push({rowIndex, placeIndex});
            }
            else {
                state.chosenSeance.selectedPlaces = state.chosenSeance.selectedPlaces.filter(place => place.rowIndex !== rowIndex && place.placeIndex !== placeIndex);
            }
        },
    },
});

export const {setBookingId,
    setIsDrawPage,
    setChosenSeance,
    setSeances,
    setHalls,
    setMovies,
    setLoading,
    changePlaceStatus,
    changeChosenDate,
    changeSelectedPlaces,
} = cinemaSlice.actions;
export const {bookingId,
    lastIsDrawPage,
    isDrawPage,
    movies,
    loading, halls,
    chosenDate, chosenSeance,
    prices, qr
} = cinemaSlice.selectors;
const cinemaReducer = cinemaSlice.reducer;
export default cinemaReducer;