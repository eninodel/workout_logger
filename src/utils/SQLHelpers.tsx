import * as SQLite from 'expo-sqlite';
import { workout } from './Interfaces';
import { setInitialWorkouts, addWorkout } from '../redux/workoutSlice';
import { Dispatch, AnyAction } from '@reduxjs/toolkit';

export const getWorkouts = (db: SQLite.WebSQLDatabase, setIsLoading: Function, dispatch: Dispatch<AnyAction>) => {
  const daysToWorkoutStrings: { [day: string]: string[] } = {
    S: [],
    M: [],
    T: [],
    W: [],
    TH: [],
    F: [],
    SA: [],
  };
  db.transaction(
    tx =>
      tx.executeSql('SELECT * FROM days_to_workouts', [], (tx, resultSet) => {
        resultSet.rows._array.forEach(arr => {
          const specificDay = arr['DAYS'];
          const specificWorkout = arr['WORKOUTS'];
          daysToWorkoutStrings[specificDay].push(specificWorkout);
        });
      }),
    e => console.log('error in getWorkoutsForEachDay: ' + e.message),
    () => {
      getAllWorkouts(db, setIsLoading, daysToWorkoutStrings, dispatch);
    },
  );
};

const getAllWorkouts = (
  db: SQLite.WebSQLDatabase,
  setIsLoading: Function,
  daysToWorkoutStrings: { [day: string]: string[] },
  dispatch: Dispatch<AnyAction>,
) => {
  let workoutArr: workout[] = [];
  db.transaction(
    tx =>
      tx.executeSql('SELECT * FROM WORKOUTS', [], (tx, resultSet) => {
        if (resultSet.rows._array.length === 0) {
          // no workouts in database
          setIsLoading(false);
          return;
        }
        resultSet.rows._array.forEach(arr =>
          workoutArr.push({
            id: arr['ID'],
            name: arr['NAME'],
            reps: arr['REPS'],
            notes: arr['NOTES'],
            workoutLink: arr['LINK'],
            lastWorkoutWeight: null,
            type: arr['TYPE'],
          }),
        );
      }),
    e => {
      console.log(e.message);
    },
    () => {
      getLastWorkoutWeight(workoutArr, db, setIsLoading, daysToWorkoutStrings, dispatch);
    },
  );
};

const getLastWorkoutWeight = async (
  workoutArr: workout[],
  db: SQLite.WebSQLDatabase,
  setIsLoading: Function,
  daysToWorkoutStrings: { [day: string]: string[] },
  dispatch: Dispatch<AnyAction>,
) => {
  await Promise.all(
    workoutArr.map(async w => {
      return new Promise((res, rej) => {
        db.transaction(
          tx =>
            tx.executeSql(
              `SELECT VALUE FROM (SELECT ID, VALUE FROM workout_data WHERE WORKOUT = ?) ORDER BY ID DESC LIMIT 1;`,
              [w.id],
              (tx, resultSet) => {
                const arr = resultSet.rows._array;
                // console.log(arr);
                if (arr.length !== 0) {
                  res({ ...w, lastWorkoutWeight: arr[0]['VALUE'] });
                } else {
                  res({ ...w });
                }
              },
            ),
          e => console.log('error in getLastWorkoutWeight: ' + e.message),
          () => {
            // console.log(newArr);
            // setworkouts(newArr);
          },
        );
      });
    }),
  ).then(val => {
    if (val.length !== 0) {
      // setworkouts(val as workout[]); // sets new values for workouts
      const workoutsWithLastWeights = val as workout[];
      const daysToWorkoutsObjects: { [day: string]: workout[] } = {
        S: [],
        M: [],
        T: [],
        W: [],
        TH: [],
        F: [],
        SA: [],
      };
      for (const day in daysToWorkoutStrings) {
        daysToWorkoutStrings[day].forEach(workoutString => {
          try {
            const specifiedWorkout = workoutsWithLastWeights.filter(w => {
              if (String(w.id) == workoutString) {
                // console.log(String(w.id) + " " + workoutString);
                return w;
              }
            })[0];
            daysToWorkoutsObjects[day].push({ ...specifiedWorkout });
          } catch (e) {
            console.log('error in getting workouts for each day');
          }
        });
      }
      // TODO dispatch workouts
      dispatch(setInitialWorkouts({ daysToWorkouts: daysToWorkoutsObjects }));
    }
    setIsLoading(false);
  });
};

export const addNewWorkoutToDay = async (
  day: string,
  workout: workout,
  db: SQLite.WebSQLDatabase,
  dispatch: Dispatch<AnyAction>,
) => {
  let insertId: number;
  db.transaction(
    tx =>
      tx.executeSql(
        'INSERT INTO workouts(NAME, REPS, NOTES, LINK, TYPE) VALUES (?,?,?,?,?);',
        [workout.name, workout.reps, String(workout.notes), String(workout.workoutLink), workout.type],
        (tx, resultSet) => {
          if (resultSet.insertId) {
            insertId = resultSet.insertId;
          }
        },
      ),
    e => {
      console.log('error in addNewWorkoutToDay');
      console.log(e.message);
    },
    () => {
      if (insertId) {
        addWorkoutToDay(day, insertId, { ...workout, id: insertId }, db, dispatch);
      }
    },
  );
};

const addWorkoutToDay = async (
  day: string,
  workoutId: number,
  workout: workout,
  db: SQLite.WebSQLDatabase,
  dispatch: Dispatch<AnyAction>,
) => {
  db.transaction(
    tx =>
      tx.executeSql(
        `INSERT INTO days_to_workouts(DAYS, WORKOUTS) VALUES(?,?);`,
        [day, workoutId],
        (tx, resultSet) => {},
      ),
    e => {
      console.log('error in addWorkoutToDay: ' + e.message);
    },
    () => {
      console.log('add workout success');
      dispatch(
        // Finally updates day after workout is successfully inserted
        addWorkout({
          day: day,
          workout: { ...workout },
        }),
      );
    },
  );
};

export const logNewWorkoutWeight = (workoutId: number, weight: number, db: SQLite.WebSQLDatabase) => {
  db.transaction(
    tx =>
      tx.executeSql(`INSERT INTO workout_data(WORKOUT, DATE, VALUE) VALUES(?,?,?);`, [
        workoutId,
        new Date().toISOString(),
        weight,
      ]),
    e => {
      console.log('error in logNewWorkoutWeight: ' + e.message);
    },
    () => {
      // console.log("log workout success");
    },
  );
};

export const deleteWorkout = (workoutId: number, db: SQLite.WebSQLDatabase) => {
  const sql = `DELETE FROM days_to_workouts WHERE WORKOUTS = ?;`;
  db.transaction(
    tx =>
      tx.executeSql(sql, [workoutId], (tx, resultSet) => {
        // console.log("workout delete success in p1");
      }),
    e => console.log('error in delete workouts 1: ' + e.message),
    () => {
      db.transaction(
        tx =>
          tx.executeSql(`DELETE FROM workouts WHERE ID = ?;`, [workoutId], (tx, resultSet) => {
            // console.log("workout delete sucess!");
          }),
        e => console.log('error in delete workouts 2: ' + e.message),
        () => {
          db.transaction(
            tx =>
              tx.executeSql(`DELETE FROM workout_data WHERE WORKOUT = ?;`, [workoutId], (tx, resultSet) => {
                // console.log("delete success");
              }),
            e => console.log('error in delete: ' + e.message),
            () => {
              console.log('delete success');
            },
          );
        },
      );
    },
  );
};

export const updateWorkout = (workoutId: number, workout: workout, db: SQLite.WebSQLDatabase) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE workouts SET NAME = ?, REPS = ?, NOTES = ?, LINK = ?, TYPE = ? WHERE ID = ?;`,
        [workout.name, workout.reps, String(workout.notes), String(workout.workoutLink), workout.type, workoutId],
        tx => {},
      );
    },
    e => {
      console.log('error in updateWorkout: ' + e.message);
    },
    () => {
      console.log('update success');
    },
  );
};
