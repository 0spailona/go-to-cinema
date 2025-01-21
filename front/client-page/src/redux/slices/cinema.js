import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
//import {fetchToken, getObjMovies, getSeancesObj} from "../../../../admin-page/src/redux/utils.js";
import {fetchToken, getHallsObj, getObjMovies} from "../utils.js";
import {toISOStringNoMs} from "../../js/utils.js";

//const basedUrl = import.meta.env.VITE_URL
//const basedUrl = "import.meta.env.VITE_URL";
const basedUrl = "";
const token = await fetchToken();

export const getSeancesByDate = createAsyncThunk(
    "getSeancesByDate",
    async (date) => {
        const response = await fetch(`${basedUrl}api/seancesListByDate?date=${date}`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);

/*export const fetchMovies = createAsyncThunk(
    "fetchMovies",
    async () => {
        const response = await fetch(`${basedUrl}api/moviesList`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);*/

/*export const fetchHalls = createAsyncThunk(
    "fetchHalls",
    async () => {
        // console.log("fetchHalls");
        const response = await fetch(`${basedUrl}api/hallsList`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);*/

export const fetchSeanceById = createAsyncThunk(
    "fetchSeanceById",
    async (id) => {
        console.log("fetchSeanceById id", id);
        const response = await fetch(`${basedUrl}api/seance/${id}`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        });
        return response.json();
    }
);


const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

const initialState = {
    loading: true,
    error: "",
    movies: {},
    halls: {},
    seances: [],
    chosenDate: toISOStringNoMs(initialDate),
    chosenSeance: {seanceData:null,takenPlaces:[],selectedPlaces:[]},
    chosenPlaces: [],
    prices: {standard: 250, vip: 350},
    qr: false
};

/*for (let film of startFilms) {
    initialState.films[film.id] = film;
}

for (let hall of startHalls) {
    initialState.halls[hall.id] = hall;
}*/

export const cinemaSlice = createSlice({
    name: "films",
    initialState,
    selectors: {
        movies: (state => state.movies),
        halls: (state) => state.halls,
        loading: (state => state.loading),
        chosenDate: state => state.chosenDate,
        chosenSeance: state => state.chosenSeance,
        chosenPlaces: state => state.chosenPlaces,
        prices: state => state.prices,
        qr: state => state.qr,
    },
    reducers: {
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

            //state.chosenSeance.hall.places[rowIndex][placeIndex] = action.payload.newStatus;
        },
        changeChosenPlaces: (state, action) => {
            const rowIndex = action.payload.rowIndex;
            const placeIndex = action.payload.placeIndex;

            if (action.payload.isSelected) {
                state.chosenPlaces.push({rowIndex, placeIndex});
            }
            else {
                state.chosenPlaces = state.chosenPlaces.filter(place => place.rowIndex !== rowIndex && place.placeIndex !== placeIndex);
            }
        },
        getQR: (state, action) => {
            console.log("getQR state", action.payload);
            state.qr = true;
        }
    },
    extraReducers:
        builder => {
            // get seances by date
            builder.addCase(getSeancesByDate.pending, (state, action) => {
                state.loadingFilms = true;
            });
            builder.addCase(getSeancesByDate.fulfilled, (state, action) => {
                //console.log("getSeancesByDate fulfilled action", action.payload);
                state.seances = action.payload.seances;
                state.loadingFilms = false;
            });
            builder.addCase(getSeancesByDate.rejected, (state, action) => {
                state.loadingFilms = false;
                state.error = "Проблема на стороне сервера";
                console.log("getSeancesByDate rejected action", action.payload);
            });

            //get movies
          /*  builder.addCase(fetchMovies.pending, (state, action) => {
                state.loadingFilms = true;
            });
            builder.addCase(fetchMovies.fulfilled, (state, action) => {
                //console.log("fetchMovies fulfilled action", action.payload);
                state.films = getObjMovies(action.payload.data);
                state.loadingFilms = false;
            });
            builder.addCase(fetchMovies.rejected, (state, action) => {
                state.loadingFilms = false;
                state.error = "Проблема на стороне сервера";
                console.log("fetchMovies rejected action", action.payload);
            });*/
            //get halls
           /* builder.addCase(fetchHalls.pending, (state, action) => {
                state.loadingFilms = true;
            });
            builder.addCase(fetchHalls.fulfilled, (state, action) => {
                //console.log("fetchHalls fulfilled action", action.payload);
                const hallsArr = action.payload.data;
                state.halls = getHallsObj(hallsArr);
                state.loadingFilms = false;
            });
            builder.addCase(fetchHalls.rejected, (state, action) => {
                state.loadingFilms = false;
                state.error = "Проблема на стороне сервера";
                console.log("fetchMovies rejected action", action.payload);
            });*/

            //get seance by id
            builder.addCase(fetchSeanceById.pending, (state, action) => {
                state.loadingFilms = true;
            });
            builder.addCase(fetchSeanceById.fulfilled, (state, action) => {
                console.log("fetchSeanceById fulfilled action", action.payload);
                if (action.payload.status === "ok") {

                }
                state.chosenSeance.seanceData = action.payload.seance;
                state.loadingFilms = false;
            });
            builder.addCase(fetchSeanceById.rejected, (state, action) => {
                state.loadingFilms = false;
                state.error = "Проблема на стороне сервера";
                console.log("fetchSeanceById rejected action", action.payload);
            });
        },
});

export const {setHalls,
    setMovies,
    setLoading,
    getFilmsByDate,
    changePlaceStatus,
    changeChosenDate,
    //changeChosenSeance,
    changeChosenPlaces,
    getQR
} = cinemaSlice.actions;
export const {
    movies,
    loading, halls,
    chosenDate, chosenSeance,
    chosenPlaces,
    prices, qr
} = cinemaSlice.selectors;
const cinemaReducer = cinemaSlice.reducer;
export default cinemaReducer;