import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Workout from "./Workout";
import { workout } from "../Interfaces";

export default function ScrollViewWithWorkouts({
  workouts,
  getWorkoutData,
}: {
  workouts: workout[];
  getWorkoutData: Function;
}): JSX.Element {
  // console.log(workouts);
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {workouts.map((w) => (
        <Workout
          workout={w}
          getWorkoutData={getWorkoutData}
          key={w.name}
        ></Workout>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    alignItems: "center",
  },
});
