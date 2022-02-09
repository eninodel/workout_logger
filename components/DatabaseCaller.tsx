import React, {useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { appStateSlice } from "../appStateSlice";
import {
  addNewWorkoutToDay,
  logNewWorkoutWeight,
  deleteWorkout,
  updateWorkout,
} from "../SQLHelpers";
import * as SQLite from "expo-sqlite";

export default function DatabaseCaller({
  db,
  children,
}: {
  db: SQLite.WebSQLDatabase;
  children: JSX.Element;
}) {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector(
    (state) => state.workoutsReducer.daysToWorkouts
  );
  const appState: appStateSlice = useAppSelector(
    (state) => state.appStateReducer
  );

  useEffect(() => {
    if (appState.workoutId !== -1) {
      switch (appState.appState) {
        case "ADD_WORKOUT":
          if (appState.day !== null && appState.workout !== null) {
            addNewWorkoutToDay(appState.day, appState.workout, db, dispatch);
          }
        case "DELETE_WORKOUT":
          if (appState.workoutId !== null) {
            deleteWorkout(appState.workoutId, db);
          }
        case "UPDATE_WORKOUT":
          if (appState.workoutId !== null && appState.workout !== null) {
            updateWorkout(appState.workoutId, appState.workout, db);
          }
        case "LOG_WORKOUT":
          if (
            appState.workoutId !== null &&
            appState.workout !== null &&
            appState.workout.lastWorkoutWeight !== null
          ) {
            logNewWorkoutWeight(
              appState.workoutId,
              appState.workout.lastWorkoutWeight,
              db
            );
          }
      }
    }
  }, [appState]);

  return <>{children}</>;
}
