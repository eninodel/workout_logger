import React, { useState, useRef } from "react";
import { Platform } from "react-native";
import { Pressable, Text, Box } from "native-base";
import { workout } from "../Interfaces";
import LogWorkoutModal from "./LogWorkoutModal";
import EditAndDeleteModal from "./EditAndDeleteModal";
import * as WebBrowser from "expo-web-browser";
import DeleteWorkoutAlertDialog from "./DeleteWorkoutAlertDialog";
import AddandEditWorkoutModal from "./AddWorkoutModal";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withDelay,
} from "react-native-reanimated";

export default function Workout({
  delay,
  workout,
}: {
  delay: number;
  workout: workout;
}): JSX.Element {
  const { name, reps, lastWorkoutWeight, workoutLink, notes, type, id } =
    workout;
  const [logModalIsOpen, setLogModalIsOpen] = useState<boolean>(false);
  const [isEditDelOpen, setIsEditDelOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const tapCount = useRef(0);
  const isBrowserOpen = useRef(false);
  const timer = useRef<NodeJS.Timeout>();
  const workoutIdToBeDeleted = useRef<number>(-1);

  const editWorkoutPlaceholder: workout = {
    ...workout,
    notes:
      notes !== null && notes !== "" && notes !== "null" ? workout.notes : "",
    workoutLink:
      workoutLink !== null && workoutLink !== "" && workoutLink !== "null"
        ? workout.workoutLink
        : "",
  };
  const offSet = useSharedValue(-300);
  offSet.value = withDelay(
    delay * 25,
    withTiming(0, {
      duration: 500,
    })
  );

  const opacityValue = useSharedValue(100);

  const updateOpacity = (workoutId: number) => {
    workoutIdToBeDeleted.current = workoutId;
    opacityValue.value = 0;
  };

  const style = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: offSet.value
          },
        ],
      };
    });

  return (
    <>
      <Animated.View style={style}>
        <Pressable
          padding={5}
          width={300}
          backgroundColor={"white"}
          borderRadius={15}
          marginTop={15}
          shadow={10}
          onLongPress={() => {
            setIsEditDelOpen(true);
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
          <Text bold fontSize={"lg"} variant={"workout"}>
            {name}
          </Text>
          <Text variant={"workout"}>Reps: {reps}</Text>
          {lastWorkoutWeight !== null && (
            <Text variant={"workout"}>Last workout: {lastWorkoutWeight} lbs</Text>
          )}
          {notes !== null && notes !== "" && notes !== "null" && (
            <Text variant={"workout"}>Note: {notes}</Text>
          )}
          {workoutLink !== null &&
            workoutLink !== "" &&
            workoutLink !== "null" && <Text variant={"workout"}>Double tap for link</Text>}
        </Pressable>
      </Animated.View>
      <EditAndDeleteModal
        isEditDelOpen={isEditDelOpen}
        setIsEditDelOpen={setIsEditDelOpen}
        setDeleteOpen={setIsDeleteOpen}
        setEditOpen={setIsEditOpen}
      />
      <LogWorkoutModal
        name={name}
        id={id}
        logModalIsOpen={logModalIsOpen}
        setLogModalIsOpen={setLogModalIsOpen}
      />
      <AddandEditWorkoutModal
        day={""}
        workout={editWorkoutPlaceholder}
        setModalIsOpen={setIsEditOpen}
        modalIsOpen={isEditOpen}
      ></AddandEditWorkoutModal>
      <DeleteWorkoutAlertDialog
        workoutId={id}
        setIsDeleteOpen={setIsDeleteOpen}
        isDeleteOpen={isDeleteOpen}
      ></DeleteWorkoutAlertDialog>
    </>
  );
}
