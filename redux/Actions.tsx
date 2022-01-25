import { ADD_WORKOUT } from "./Types";
export const addWorkouts = (daysToWorkouts, workouts) => {
  return { payload: { daysToWorkouts, workouts }, type: ADD_WORKOUT };
};
