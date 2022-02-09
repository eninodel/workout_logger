import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { workout } from "./Interfaces";

export interface appStateSlice {
  workoutId: number | null;
  workout: workout | null;
  day: string | null;
  appState: "UPDATE_WORKOUT" | "DELETE_WORKOUT" | "ADD_WORKOUT" | "LOG_WORKOUT";
}

const initialState: appStateSlice = {
  workoutId: null,
  workout: null,
  day: null,
  appState: "ADD_WORKOUT",
};

export const appStateSlice = createSlice({
  name: "appStateSlice",
  initialState,
  reducers: {
    updateAppState: (state, action: PayloadAction<appStateSlice>) => {
      state.appState = action.payload.appState;
      state.workoutId = action.payload.workoutId;
      state.workout = action.payload.workout;
      state.day = action.payload.day;
    },
  },
});

export const { updateAppState } = appStateSlice.actions;

export default appStateSlice.reducer;
