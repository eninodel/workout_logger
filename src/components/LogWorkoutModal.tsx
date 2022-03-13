import React, { useState } from 'react';
import { Modal, Button, FormControl, NumberInput, NumberInputField, Text } from 'native-base';
import { useAppDispatch } from '../redux/hooks';
import { updateLastWorkoutWeight } from '../redux/workoutSlice';
import { updateAppState } from '../redux/appStateSlice';
import { workout } from '../utils/Interfaces';

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
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  return (
    <Modal
      onClose={() => {
        setWeight(0);
        setIsInvalid(false);
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
            {isInvalid && (
              <FormControl.HelperText>
                <Text variant="error">Weight/value must be greater than 0</Text>
              </FormControl.HelperText>
            )}
            <NumberInput>
              <NumberInputField
                size={70}
                width="full"
                marginBottom={10}
                defaultValue={String(weight)}
                onChange={val => {
                  if (isInvalid) {
                    setIsInvalid(false);
                  }
                  setWeight(Number(val.nativeEvent.text));
                }}
              />
            </NumberInput>
          </FormControl>
          <Button
            size={70}
            width="full"
            onPress={() => {
              if (weight === 0) {
                setIsInvalid(true);
                return;
              }
              dispatch(
                updateLastWorkoutWeight({
                  id: id,
                  weight: weight,
                }),
              );
              const pseudoWorkout: workout = {
                name: '',
                reps: '',
                lastWorkoutWeight: weight,
                notes: '',
                workoutLink: '',
                id: id,
                type: '',
              };
              dispatch(
                updateAppState({
                  workoutId: id,
                  workout: pseudoWorkout,
                  day: null,
                  appState: 'LOG_WORKOUT',
                }),
              );
              setIsInvalid(false);
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
