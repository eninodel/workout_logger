import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { workout } from '../utils/Interfaces';

const daysOfWeek: Array<string> = ['S', 'M', 'T', 'W', 'TH', 'F', 'SA'];

export interface addWorkoutSlice {
  day: string;
  workout: workout;
}

export interface updateWorkoutSlice {
  id: number;
  workout: workout;
}

export interface updateLastWorkoutWeightSlice {
  id: number;
  weight: number;
}

export interface workoutSliceState {
  daysToWorkouts: {
    [day: string]: workout[];
  };
}

const initialState: workoutSliceState = {
  daysToWorkouts: { S: [], M: [], T: [], W: [], TH: [], F: [], SA: [] },
};

export const workoutSlice = createSlice({
  name: 'workoutSlice',
  initialState,
  reducers: {
    setInitialWorkouts: (state, action: PayloadAction<workoutSliceState>) => {
      state.daysToWorkouts = action.payload.daysToWorkouts;
    },
    updateWorkout: (state, action: PayloadAction<updateWorkoutSlice>) => {
      daysOfWeek.map(day => {
        state.daysToWorkouts[day].forEach((w, idx) => {
          if (w.id == action.payload.id) {
            state.daysToWorkouts[day][idx] = {
              ...action.payload.workout,
              lastWorkoutWeight: w.lastWorkoutWeight,
            }; // overwrites everything but lastworkout weight
          }
        });
      });
    },
    deleteWorkout: (state, action: PayloadAction<number>) => {
      daysOfWeek.map(day => {
        state.daysToWorkouts[day] = state.daysToWorkouts[day].filter(w => w.id !== action.payload);
      });
    },
    addWorkout: (state, action: PayloadAction<addWorkoutSlice>) => {
      state.daysToWorkouts[action.payload.day].push({
        ...action.payload.workout,
      });
    },
    updateLastWorkoutWeight: (state, action: PayloadAction<updateLastWorkoutWeightSlice>) => {
      daysOfWeek.map(day => {
        state.daysToWorkouts[day].forEach((w, idx) => {
          if (w.id == action.payload.id) {
            state.daysToWorkouts[day][idx] = {
              ...w,
              lastWorkoutWeight: action.payload.weight,
            }; // adds workout weight to specified workout
          }
        });
      });
    },
  },
});

export const { setInitialWorkouts, updateWorkout, deleteWorkout, addWorkout, updateLastWorkoutWeight } =
  workoutSlice.actions;

export default workoutSlice.reducer;
