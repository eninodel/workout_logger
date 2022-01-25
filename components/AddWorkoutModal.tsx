import React, { useState } from "react";
import { Modal, Input, Button, FormControl, Radio } from "native-base";
import { workout } from "../Interfaces";

const initialData: workout = {
  name: "",
  workoutLink: "",
  lastWorkoutWeight: null,
  reps: "",
  notes: "",
  type: "WEIGHT",
};

export default function AddWorkoutModal({
  addWorkout,
  setModalIsOpen,
  modalIsOpen,
}: {
  addWorkout: Function;
  setModalIsOpen: Function;
  modalIsOpen: boolean;
}): JSX.Element {
  const [formData, setFormData] = useState<workout>(initialData);

  return (
    <Modal
      onClose={() => {
        setFormData(initialData);
        setModalIsOpen(false);
      }}
      isOpen={modalIsOpen}
      avoidKeyboard={true}
    >
      <Modal.Content>
        <Modal.CloseButton></Modal.CloseButton>
        <Modal.Header>Add a Workout</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Workout Name</FormControl.Label>
            <Input
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
              }}
            ></Input>
            <FormControl.Label>Workout Reps</FormControl.Label>
            <Input
              onChangeText={(text) => {
                setFormData({ ...formData, reps: text });
              }}
            ></Input>
            <FormControl.Label>Workout Example Link (Opt.)</FormControl.Label>
            <Input
              onChangeText={(text) => {
                if (text === "" || text === null) {
                  setFormData({ ...formData, workoutLink: "" });
                } else {
                  setFormData({ ...formData, workoutLink: text });
                }
              }}
            ></Input>
            <FormControl.Label>Workout Notes (Opt.)</FormControl.Label>
            <Input
              onChangeText={(text) => {
                if (text === "" || text === null) {
                  setFormData({ ...formData, notes: "" });
                } else {
                  setFormData({ ...formData, notes: text });
                }
              }}
            ></Input>
            <Radio.Group
              name="workout type"
              value={formData.type}
              onChange={(nextValue) =>
                setFormData({ ...formData, type: nextValue })
              }
            >
              <Radio value="WEIGHT">Weight</Radio>
              <Radio value="CARDIO">Cardio</Radio>
              <Radio value="OTHER">Other</Radio>
            </Radio.Group>
          </FormControl>
          <Button
            size={70}
            width="full"
            onPress={() => {
              addWorkout(
                formData.name.trim(),
                formData.reps.trim(),
                formData.notes?.trim(),
                formData.workoutLink?.trim(),
                formData.type
              );
              setModalIsOpen(false);
            }}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
