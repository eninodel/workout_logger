import React, { useState } from "react";
import {
  Modal,
  Button,
  FormControl,
  NumberInput,
  NumberInputField,
} from "native-base";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("workouts.db");

export default function LogWorkoutModal({
  name,
  logModalIsOpen,
  setLogModalIsOpen,
  getWorkoutData,
}: {
  name: string;
  logModalIsOpen: boolean;
  setLogModalIsOpen: Function;
  getWorkoutData: Function;
}) {
  const [weight, setWeight] = useState<number>(0);

  // Logs data about a workout into the database
  const logWorkoutData = () => {
    const sql: string = `INSERT INTO workout_data(WORKOUT, DATE, VALUE) VALUES(?,?,?);`;
    db.transaction(
      (tx) =>
        tx.executeSql(
          sql,
          [name, new Date().toISOString(), weight],
          (tx, resultSet) => {
            console.log("logWorkoutdata success!");
          }
        ),
      (e) => console.log("error in logWorkoutData: " + e.message),
      () => {
        getWorkoutData();
      }
    );
  };

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
        <Modal.Header>Log Workout Value</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Weight,Minutes,etc.</FormControl.Label>
            <NumberInput>
              <NumberInputField
                size={70}
                width="full"
                marginBottom={10}
                value={String(weight)}
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
              logWorkoutData();
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
