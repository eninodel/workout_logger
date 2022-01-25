import React, { useRef } from "react";
import { AlertDialog, Button } from "native-base";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("workouts.db");

export default function DeleteWorkoutAlertDialog({
  name,
  setAlertIsOpen,
  alertIsOpen,
  getWorkoutData,
}: {
  name: string;
  setAlertIsOpen: Function;
  alertIsOpen: boolean;
  getWorkoutData: Function;
}) {
  // Deletes workout from database including join table between days and workouts
  // as well as any workout data.
  const deleteWorkout = () => {
    const sql = `DELETE FROM days_to_workouts WHERE WORKOUTS LIKE ?;`;
    db.transaction(
      (tx) =>
        tx.executeSql(sql, [name], (tx, resultSet) => {
          // console.log("workout delete success in p1");
        }),
      (e) => console.log("error in delete workouts 1: " + e.message),
      () => {
        db.transaction(
          (tx) =>
            tx.executeSql(
              `DELETE FROM workouts WHERE NAME LIKE ?;`,
              [name],
              (tx, resultSet) => {
                // console.log("workout delete sucess!");
              }
            ),
          (e) => console.log("error in delete workouts 2: " + e.message),
          () => {
            db.transaction(
              (tx) =>
                tx.executeSql(
                  `DELETE FROM workout_data WHERE WORKOUT LIKE ?;`,
                  [name],
                  (tx, resultSet) => {
                    // console.log("delete success");
                  }
                ),
              (e) => console.log("error in delete: " + e.message),
              () => {
                getWorkoutData();
              }
            );
          }
        );
      }
    );
  };

  const cancelRef = useRef(null);
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={alertIsOpen}
      onClose={() => setAlertIsOpen(false)}
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
                setAlertIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                deleteWorkout();
                setAlertIsOpen(false);
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
