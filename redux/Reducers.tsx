import { combineReducers } from "redux";
import { ADD_WORKOUT } from "./Types";

// daysToWorkouts: object {day: workout name<string>}
const INITIAL_STATE = {
  daysToWorkouts: { S: [], M: [], T: [], W: [], TH: [], F: [], SA: [] },
  workouts: [],
};

const workoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_WORKOUT:
      return {
        ...state,
        daysToWorkouts: action.payload.daysToWorkouts,
        workouts: action.payload.workouts,
      };
    default:
      return state;
  }
};

export default combineReducers({
  workoutReducer,
});
