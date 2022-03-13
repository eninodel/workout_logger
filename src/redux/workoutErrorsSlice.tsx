import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface workoutErrorsSlice {
  errorState: 'NO_REPS_OR_TITLE' | 'COULD_NOT_WRITE_TO_DB' | null;
}

const initialState: workoutErrorsSlice = {
  errorState: null,
};

export const workoutErrorsSlice = createSlice({
  name: 'workoutErrorsSlice',
  initialState,
  reducers: {
    updateWorkoutErrorsState: (state, action: PayloadAction<workoutErrorsSlice>) => {
      state.errorState = action.payload.errorState;
    },
  },
});

export const { updateWorkoutErrorsState } = workoutErrorsSlice.actions;

export default workoutErrorsSlice.reducer;
