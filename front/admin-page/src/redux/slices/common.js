import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    error: null
};

const commonSlice = createSlice({
        name: "common",
        initialState,
        selectors: {
            error: (state => state.error),
        },
        reducers: {
            setError: (state, action) => {
                state.error = action.payload;
            },
        },

    })
;


export const {
    setError,
} = commonSlice.actions;
export const {
    error
} = commonSlice.selectors;
const commonReducer = commonSlice.reducer;
export default commonReducer;
