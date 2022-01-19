import React, { Component, ReactNode, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ScrollView, Button, Modal, FormControl, Input } from "native-base";
import Workout from "./Workout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export interface dayWorkouts {
  title: string;
  reps: string;
  lastWorkoutWeight: number | null;
  workoutLink: string | null;
}

export interface workoutFormData {
  title: string;
  reps: string;
  workoutLink: string | null;
}

export default function DailyPage({ route, navigation }): JSX.Element {
  const { day } = route.params;
  const [workouts, setWorkouts] = useState<dayWorkouts[] | null>([
    {
      title: "",
      reps: "",
      workoutLink: null,
      lastWorkoutWeight: null,
    },
  ]);
  const [addWorkout, setAddWorkout] = useState<boolean>(false);
  const [formData, setFormData] = useState<workoutFormData>({
    title: "",
    reps: "",
    workoutLink: null,
  });

  // const getWorkouts = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem(day).then((val) => {
  //       if (val === undefined) {
  //         setWorkouts(null);
  //       } else {
  //         console.log(val);
  //         setWorkouts(val);
  //       }
  //     });
  //     return value;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    // getWorkouts();
    setWorkouts([
      {
        title: "Ejejdhd",
        reps: "Ehendhd",
        workoutLink: null,
        lastWorkoutWeight: null,
      },
      {
        title: "Sndjsjfn",
        reps: "Djskdjsjf",
        workoutLink: "Djdjdjxhdjdjx",
        lastWorkoutWeight: null,
      },
    ]);
    // console.log(day);
  }, []);
  const renderWorkouts = (): ReactNode => {
    const data: dayWorkouts[] | null = JSON.parse(String(workouts));
    return data === null ? (
      <Workout title="" reps="" lastWorkoutWeight={4} workoutLink=""></Workout>
    ) : (
      <>
        {data.map((w) => (
          <Workout
            title={w.title}
            lastWorkoutWeight={w.lastWorkoutWeight}
            reps={w.reps}
            workoutLink={w.workoutLink}
          ></Workout>
        ))}
      </>
    );
  };

  const addWorkoutToStorage = async () => {
    // let newWorkout: dayWorkouts = {
    //   title: "",
    //   reps: "",
    //   workoutLink: null,
    //   lastWorkoutWeight: null,
    // };
    // if (formData.title === "") {
    //   return;
    // }
    // if (formData.reps === "") {
    //   return;
    // }
    // if (formData.workoutLink !== "" && formData.workoutLink !== null) {
    //   newWorkout.workoutLink = formData.workoutLink;
    // }
    // newWorkout.title = formData.title;
    // newWorkout.reps = formData.reps;
    // try {
    //   if (workouts !== null) {
    //     const data: dayWorkouts[] = JSON.parse(String(workouts));
    //     data.push(newWorkout);
    //     await AsyncStorage.setItem(day, JSON.stringify(data)).then(getWorkouts);
    //   } else {
    //     await AsyncStorage.setItem(day, JSON.stringify([newWorkout])).then(
    //       getWorkouts
    //     );
    //   }
    //   setAddWorkout(false);
    //   setFormData({ title: "", reps: "", workoutLink: null });
    // } catch (e) {
    //   console.log("error in addworkout to storage");
    // }
  };

  return (
    <>
      <ScrollView>
        {workouts && workouts.map((w) => Workout({ ...w }))}
      </ScrollView>
      <Modal
        avoidKeyboard
        isOpen={addWorkout}
        onClose={() => {
          setAddWorkout(false);
          setFormData({ title: "", reps: "", workoutLink: null });
        }}
      >
        <Modal.Content>
          <Modal.CloseButton></Modal.CloseButton>
          <Modal.Header>Add Workout</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Workout Title</FormControl.Label>
              <Input
                placeholder="Workout Title"
                type="text"
                onChangeText={(value) =>
                  setFormData({ ...formData, title: value })
                }
              ></Input>
              <FormControl.Label>Reps</FormControl.Label>
              <Input
                placeholder="reps"
                type="text"
                onChangeText={(value) =>
                  setFormData({ ...formData, reps: value })
                }
              ></Input>
              <FormControl.Label>Workout link</FormControl.Label>
              <Input
                placeholder="Workout Link"
                type="text"
                onChangeText={(value) =>
                  setFormData({ ...formData, workoutLink: value })
                }
              ></Input>
            </FormControl>
            <Button onPress={addWorkoutToStorage}>Submit</Button>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal.Content>
      </Modal>
      <Button
        leftIcon={<AntDesign name="plus" size={24} color="black" />}
        onPress={() => setAddWorkout(true)}
      />
    </>
  );
}
