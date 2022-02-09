import React, { useState } from "react";
import { Modal, Input, Button, FormControl, Radio, TextArea } from "native-base";
import { workout } from "../Interfaces";
import { useAppDispatch } from "../hooks";
import { updateWorkout } from "../workoutSlice";
import { updateAppState } from "../appStateSlice";

const initialData: workout = {
  id: 0,
  name: "",
  workoutLink: "",
  lastWorkoutWeight: null,
  reps: "",
  notes: "",
  type: "WEIGHT",
};

type radioDataType = "WEIGHT" | "CARDIO" | "OTHER";

export default function AddandEditWorkoutModal({
  day,
  setModalIsOpen,
  modalIsOpen,
  workout,
}: {
  day: string;
  setModalIsOpen: Function;
  modalIsOpen: boolean;
  workout: workout | null;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<workout>(workout || initialData);
  const [radioData, setRadioData] = useState<radioDataType>("WEIGHT");

  return (
    <Modal
      onClose={() => {
        if (workout === null) {
          setFormData(initialData);
          setRadioData("WEIGHT");
        }
        setModalIsOpen(false);
      }}
      isOpen={modalIsOpen}
      avoidKeyboard={true}
    >
      <Modal.Content>
        <Modal.CloseButton></Modal.CloseButton>
        <Modal.Header>{workout? "Edit " + workout.name: "Add a workout"}</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Workout Name</FormControl.Label>
            <Input
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
              }}
            ></Input>
            <FormControl.Label>Workout Reps</FormControl.Label>
            <Input
              value={formData.reps}
              onChangeText={(text) => {
                setFormData({ ...formData, reps: text });
              }}
            ></Input>
            <FormControl.Label>Workout Example Link (Opt.)</FormControl.Label>
            <Input
              value={formData.workoutLink || ""}
              onChangeText={(text) => {
                if (text === null) {
                  setFormData({ ...formData, workoutLink: "" });
                } else {
                  setFormData({ ...formData, workoutLink: text });
                }
              }}
            ></Input>
            <FormControl.Label>Workout Notes (Opt.)</FormControl.Label>
            <TextArea
              value={formData.notes || ""}
              onChangeText={(text) => {
                if (text === null) {
                  setFormData({ ...formData, notes: "" });
                } else {
                  setFormData({ ...formData, notes: text });
                }
              }}
            ></TextArea>
            <Radio.Group
              name="workout type"
              value={radioData}
              onChange={(nextValue) => {
                setRadioData(nextValue as radioDataType);
              }}
            >
              <Radio value="WEIGHT">Weight</Radio>
              <Radio value="CARDIO">Cardio</Radio>
              <Radio value="OTHER">Other</Radio>
            </Radio.Group>
          </FormControl>
          <Button
            size={70}
            width="full"
            marginTop={5}
            onPress={() => {
              const finalFormData: workout = {
                id: 0,
                lastWorkoutWeight: null,
                name: formData.name.trim(),
                notes: formData.notes?.trim() || null,
                workoutLink: formData.workoutLink?.trim() || null,
                reps: formData.reps.trim(),
                type: radioData,
              };
              if (finalFormData.name === "" || finalFormData.reps === "") {
                setModalIsOpen(false); // basic form validation
                return;
              }
              if (workout) {
                dispatch(
                  updateWorkout({
                    id: workout.id,
                    workout: { ...finalFormData },
                  })
                );
                dispatch(
                  updateAppState({
                    workoutId: workout.id,
                    day: null,
                    workout: { ...finalFormData },
                    appState: "UPDATE_WORKOUT",
                  })
                );
              } else {
                dispatch(
                  updateAppState({
                    workoutId: null,
                    day: day,
                    workout: { ...finalFormData },
                    appState: "ADD_WORKOUT",
                  })
                );
              }
              setModalIsOpen(false);
              if (workout) {
                setFormData({ ...finalFormData });
              } else {
                setFormData(initialData);
              }
              setRadioData("WEIGHT");
            }}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
