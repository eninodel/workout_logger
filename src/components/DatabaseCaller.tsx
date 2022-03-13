import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { appStateSlice } from '../redux/appStateSlice';
import { addNewWorkoutToDay, logNewWorkoutWeight, deleteWorkout, updateWorkout } from '../utils/SQLHelpers';
import * as SQLite from 'expo-sqlite';

export default function DatabaseCaller({ db, children }: { db: SQLite.WebSQLDatabase; children: JSX.Element }) {
  const dispatch = useAppDispatch();
  const appState: appStateSlice = useAppSelector(state => state.appStateReducer);

  useEffect(() => {
    if (appState.workoutId !== -1) {
      switch (appState.appState) {
        case 'ADD_WORKOUT':
          if (appState.day !== null && appState.workout !== null) {
            addNewWorkoutToDay(appState.day, appState.workout, db, dispatch);
          }
        case 'DELETE_WORKOUT':
          if (appState.workoutId !== null) {
            deleteWorkout(appState.workoutId, db);
          }
        case 'UPDATE_WORKOUT':
          if (appState.workoutId !== null && appState.workout !== null) {
            updateWorkout(appState.workoutId, appState.workout, db);
          }
        case 'LOG_WORKOUT':
          if (appState.workoutId !== null && appState.workout !== null && appState.workout.lastWorkoutWeight !== null) {
            logNewWorkoutWeight(appState.workoutId, appState.workout.lastWorkoutWeight, db);
          }
      }
    }
  }, [appState]);

  return <>{children}</>;
}
