import React, { useState} from "react";
import { Button, Text, Center, Alert, Collapse, IconButton, CloseIcon } from "native-base";
import ScrollViewWithWorkouts from "./ScrollViewWithWorkouts";
import AddWorkoutModal from "./AddWorkoutModal";
import { workout } from "../Interfaces";
import { useAppSelector } from "../hooks";


// TODO: add typing for route and navigation
export default function DailyPage({ route, navigation }): JSX.Element {
  const { day }: { day: string } = route.params;
  const workouts: workout[] = useAppSelector(
    (state) => state.workoutsReducer.daysToWorkouts[day]
  );
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  // const error = useAppSelector(state => state.workoutErrorsReducer.errorState);
  // const [isWorkoutAlertVisible, setIsWorkoutAlertVisible] = useState<boolean>(true);

  if (day === "SA") console.log(workouts)
  return (
    <>
      {workouts.length > 0 ? (
        <ScrollViewWithWorkouts workouts={workouts}></ScrollViewWithWorkouts>
      ) : (
        <Center flex={1}>
          <Text variant={"noWorkouts"}>
            No workouts added! Click "+" at the bottom to add workouts!
          </Text>
        </Center>
      )}

      <AddWorkoutModal
        day={day}
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        workout={null}
      ></AddWorkoutModal>
      <Button onPress={() => setModalIsOpen(true)}>+</Button>
    </>
  );
}
