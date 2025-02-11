import { createSlice } from "@reduxjs/toolkit";
import { globalState } from "./states/globalState";
import { globalStateActions } from "./actions/globalActions"

export const globalSlices = createSlice({
    name: 'global',
    initialState: globalState,
    reducers: globalStateActions,
})

export const globalActions = globalSlices.actions;
export default globalSlices.reducer;