import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { Button } from "native-base";
import ScrollViewWithWorkouts from "./ScrollViewWithWorkouts";
import AddWorkoutModal from "./AddWorkoutModal";
import * as SQLite from "expo-sqlite";
import { getWorkoutsForGivenDay } from "../SQLHelpers";
import { workout } from "../Interfaces";
// import { useSelector } from "react-redux";

const db = SQLite.openDatabase("workouts.db");

// TODO: add typing for route and navigation
export default function DailyPage({ route, navigation }): JSX.Element {
  const { day }: { day: string } = route.params;
  const [workouts, setWorkouts] = useState<workout[] | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  // const work = useSelector(state => state)

  useEffect(() => {
    getWorkoutData();
  }, []);

  const getWorkoutData = () => {
    getWorkoutsForGivenDay(day, db, setWorkouts, workouts);
  };

  const addWorkout = (
    name: string,
    reps: string,
    notes: string | null,
    link: string | null,
    type: string
  ) => {
    if (name.length === 0 || reps.length === 0) return;
    const workoutsql = `INSERT INTO workouts(NAME, REPS, NOTES, LINK, TYPE) VALUES (?, ?, ?, ?, ?);`;
    db.transaction(
      (tx) =>
        tx.executeSql(
          workoutsql,
          [name, reps, String(notes), String(link), type],
          (tx, resultSet) => console.log("added workout success")
        ),
      (e) => console.log("error in addWorkout: " + e.message),
      () => {
        const days_to_workoutssql: string = `INSERT INTO days_to_workouts (DAYS, WORKOUTS) VALUES (?, ?);`;
        db.transaction(
          (tx) =>
            tx.executeSql(days_to_workoutssql, [day, name], (tx, resultSet) => {
              // console.log("day to workout connection success");
            }),
          (e) =>
            console.log(
              "error in addWorkout with days_to_workoutsql: " + e.message
            ),
          () => {
            getWorkoutData();
          }
        );
      }
    );
  };

  return (
    <>
      {workouts !== null ? (
        <ScrollViewWithWorkouts
          workouts={workouts}
          getWorkoutData={getWorkoutData}
        ></ScrollViewWithWorkouts>
      ) : (
        <View style={{ flex: 1 }}>
          <Text>
            {" "}
            No workouts added! Click "+" at the bottom to add workouts!
          </Text>
        </View>
      )}
      <AddWorkoutModal
        addWorkout={addWorkout}
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
      ></AddWorkoutModal>
      <Button onPress={() => setModalIsOpen(true)}>+</Button>
    </>
  );
}
