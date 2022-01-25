import React, { ReactElement, useState, useRef } from "react";
import { Platform, Pressable, Text } from "react-native";
import { workout } from "../Interfaces";
import LogWorkoutModal from "./LogWorkoutModal";
import DeleteWorkoutAlertDialog from "./DeleteWorkoutAlertDialog";
import * as WebBrowser from "expo-web-browser";

export default function Workout({
  workout,
  getWorkoutData,
}: {
  workout: workout;
  getWorkoutData: Function;
}): JSX.Element {
  const { name, reps, lastWorkoutWeight, workoutLink, notes, type } = workout;
  const [logModalIsOpen, setLogModalIsOpen] = useState<boolean>(false);
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const tapCount = useRef(0);
  const isBrowserOpen = useRef(false);
  const timer = useRef<NodeJS.Timeout>();

  return (
    <>
      <Pressable
        style={{
          borderColor: "gray",
          borderWidth: 5,
          borderRadius: 15,
          width: "80%",
          alignContent: "center",
          alignItems: "center",
          marginTop: 10,
          // height: 120,
        }}
        onLongPress={() => {
          setAlertIsOpen(true);
        }}
        onPress={() => {
          tapCount.current++;
          if (tapCount.current === 2) {
            clearTimeout(timer.current as NodeJS.Timeout);
            tapCount.current = 0;
            if (
              workoutLink !== null &&
              workoutLink !== "" &&
              isBrowserOpen.current === false
            ) {
              isBrowserOpen.current = true;
              try {
                // console.log(workoutLink);
                WebBrowser.openBrowserAsync(workoutLink)
                  .then((value) => (isBrowserOpen.current = false))
                  .finally(() => {
                    if (Platform.OS === "ios") {
                      WebBrowser.dismissBrowser();
                    }
                  });
              } catch (e) {
                if (Platform.OS === "ios") {
                  WebBrowser.dismissBrowser();
                }
              }
            }
          } else {
            timer.current = setTimeout(() => {
              tapCount.current = 0;
              setLogModalIsOpen(true);
            }, 500);
          }
        }}
      >
        <Text style={{ fontSize: 25, color: "black" }}>{name}</Text>
        <Text style={{}}>{reps}</Text>
        {lastWorkoutWeight !== null && (
          <Text>Last workout: {lastWorkoutWeight}</Text>
        )}
        {notes !== null && notes !== "" && <Text>{notes}</Text>}
        {workoutLink !== null && workoutLink !== "" && (
          <Text>Double tap for link</Text>
        )}
      </Pressable>
      <DeleteWorkoutAlertDialog
        name={name}
        setAlertIsOpen={setAlertIsOpen}
        alertIsOpen={alertIsOpen}
        getWorkoutData={getWorkoutData}
      ></DeleteWorkoutAlertDialog>
      <LogWorkoutModal
        name={name}
        logModalIsOpen={logModalIsOpen}
        setLogModalIsOpen={setLogModalIsOpen}
        getWorkoutData={getWorkoutData}
      ></LogWorkoutModal>
    </>
  );
}
