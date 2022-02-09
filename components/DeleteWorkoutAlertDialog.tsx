import React, { useRef } from "react";
import { AlertDialog, Button } from "native-base";
import { useAppDispatch } from "../hooks";
import { deleteWorkout } from "../workoutSlice";
import { updateAppState } from "../appStateSlice";

export default function DeleteWorkoutAlertDialog({
  workoutId,
  setIsDeleteOpen,
  isDeleteOpen,
}: {
  workoutId: number;
  setIsDeleteOpen: Function;
  isDeleteOpen: boolean;
}) {
  const cancelRef = useRef(null);
  const dispatch = useAppDispatch();

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isDeleteOpen}
      onClose={() => setIsDeleteOpen(false)}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton></AlertDialog.CloseButton>
        <AlertDialog.Header>Delete Workout?</AlertDialog.Header>
        <AlertDialog.Body>
          This will remove all related data. This action cannot be undone.
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              onPress={() => {
                setIsDeleteOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                dispatch(deleteWorkout(workoutId));
                dispatch(
                  updateAppState({
                    workoutId: workoutId,
                    workout: null,
                    day: null,
                    appState: "DELETE_WORKOUT",
                  })
                );
                setIsDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
