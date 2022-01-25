import * as SQLite from "expo-sqlite";
import { workout } from "./components/DailyPage";

export const getWorkoutsForGivenDay = (
  day: string,
  db: SQLite.WebSQLDatabase,
  setworkouts: Function,
  workouts: workout[] | null
) => {
  let workoutArr: workout[] = [];
  db.transaction(
    (tx) =>
      tx.executeSql(
        "SELECT * FROM WORKOUTS WHERE NAME IN (SELECT WORKOUTS FROM days_to_workouts WHERE DAYS LIKE ?);",
        [day],
        (tx, resultSet) => {
          if (resultSet.rows._array.length === 0) {
            setworkouts(null);
            return;
          }
          resultSet.rows._array.forEach((arr) =>
            workoutArr.push({
              name: arr["NAME"],
              reps: arr["REPS"],
              notes: arr["NOTES"],
              workoutLink: arr["LINK"],
              lastWorkoutWeight: null,
              type: arr["TYPE"],
            })
          );
        }
      ),
    (e) => {
      console.log(e.message);
    },
    () => {
      // console.log(workoutArr);
      getLastWorkoutWeight(workoutArr, db, setworkouts, workouts);
    }
  );
};

const getLastWorkoutWeight = async (
  workoutArr: workout[],
  db: SQLite.WebSQLDatabase,
  setworkouts: Function,
  workouts: workout[] | null
) => {
  await Promise.all(
    workoutArr.map(async (w) => {
      return new Promise((res, rej) => {
        db.transaction(
          (tx) =>
            tx.executeSql(
              `SELECT VALUE FROM (SELECT ID, VALUE FROM workout_data WHERE WORKOUT like ?) ORDER BY ID DESC LIMIT 1;`,
              [w.name],
              (tx, resultSet) => {
                const arr = resultSet.rows._array;
                if (arr.length !== 0) {
                  res({ ...w, lastWorkoutWeight: arr[0]["VALUE"] });
                } else {
                  res({ ...w });
                }
              }
            ),
          (e) => console.log("error in getLastWorkoutWeight: " + e.message),
          () => {
            // console.log(newArr);
            // setworkouts(newArr);
          }
        );
      });
    })
  ).then((val) => {
    // console.log("promise values:");
    if (val.length !== 0) {
      setworkouts(val as workout[]); // sets new values for workouts
    }
  });
};
