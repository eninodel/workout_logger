import React, { ReactElement, ReactNode, useState } from "react";
import {
  Box,
  Center,
  View,
  Text,
  Modal,
  FormControl,
  Input,
  Button,
} from "native-base";
import { Pressable } from "react-native";
import { dayWorkouts } from "./DailyPage";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface individualWorkout {
  date: string;
  num: number;
}

export default function Workout({
  title,
  reps,
  lastWorkoutWeight,
  workoutLink,
}: dayWorkouts): ReactElement {
  // const [formData, setFormData] = useState<dayWorkouts>({
  //   title: title,
  //   reps: reps,
  //   lastWorkoutWeight: lastWorkoutweight,
  //   workoutLink: workoutLink,
  // });
  // const [workOutData, setWorkoutData] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);

  const submitAddWorkout = async () => {
    if (5 === 0) {
      return; // didn't fill out form
    }
    const val = AsyncStorage.getItem(title); // individual workout data
    const newWorkoutData: individualWorkout = {
      date: new Date().toISOString(),
      num: 5,
    };
    if (val === null) {
      AsyncStorage.setItem(title, JSON.stringify([newWorkoutData]));
    } else {
      const jsonVal: individualWorkout[] = JSON.parse(String(val));
      jsonVal.push(newWorkoutData);
      AsyncStorage.setItem(title, JSON.stringify(jsonVal));
    }
    // setModalOpen(false);
    // setWorkoutCompleted(true);
    //call re render for parent
  };

  return (
    <>
      <Pressable
        style={{
          borderColor: "black",
          borderWidth: 5,
          borderRadius: 5,
          width: "80%",
          alignContent: "center",
          alignItems: "center",
        }}
        // onPress={() => setModalOpen(true)}
        key={title}
      >
        <Text>{title}</Text>
        <Text>Reps: {reps}</Text>
        <Text>Last workout weight: {lastWorkoutWeight}</Text>
        <Text>Link: {workoutLink}</Text>
      </Pressable>
      {/* <Modal
        avoidKeyboard
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // setFormData({ title: "", reps: "", workoutLink: null });
        }}
      >
        <Modal.Content>
          <Modal.CloseButton></Modal.CloseButton>
          <Modal.Header>Add Workout</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Current Workout Weight</FormControl.Label>
              <Input
                type="number"
                onChange={(value) => console.log(value)}
              ></Input>
            </FormControl>
            <Button onPress={submitAddWorkout}>Submit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal> */}
    </>
  );
}
