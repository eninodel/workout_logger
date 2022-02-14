import React, { useState } from "react";
import {
  Modal,
  Button,
  FormControl,
  NumberInput,
  NumberInputField,
} from "native-base";
import { useAppDispatch } from "../hooks";
import { updateLastWorkoutWeight } from "../workoutSlice";
import { updateAppState } from "../appStateSlice";
import { workout } from "../Interfaces";

export default function LogWorkoutModal({
  name,
  id,
  logModalIsOpen,
  setLogModalIsOpen,
}: {
  name: string;
  id: number;
  logModalIsOpen: boolean;
  setLogModalIsOpen: Function;
}) {
  const [weight, setWeight] = useState<number>(0);
  const dispatch = useAppDispatch();

  return (
    <Modal
      onClose={() => {
        setWeight(0);
        setLogModalIsOpen(false);
      }}
      isOpen={logModalIsOpen}
    >
      <Modal.Content>
        <Modal.CloseButton></Modal.CloseButton>
        <Modal.Header>Log Workout Value for {name}</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Weight,Minutes,etc.</FormControl.Label>
            <NumberInput>
              <NumberInputField
                size={70}
                width="full"
                marginBottom={10}
                defaultValue={String(weight)}
                onChange={(val) => setWeight(Number(val.nativeEvent.text))}
              />
            </NumberInput>
          </FormControl>
          <Button
            size={70}
            width="full"
            onPress={() => {
              if (weight === 0) {
                return;
              }
              dispatch(
                updateLastWorkoutWeight({
                  id: id,
                  weight: weight,
                })
              );
              const pseudoWorkout: workout = {
                name: "",
                reps: "",
                lastWorkoutWeight: weight,
                notes: "",
                workoutLink: "",
                id: id,
                type: "",
              };
              dispatch(
                updateAppState({
                  workoutId: id,
                  workout: pseudoWorkout,
                  day: null,
                  appState: "LOG_WORKOUT",
                })
              );
              setLogModalIsOpen(false);
            }}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
