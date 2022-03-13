import React, { useState } from 'react';
import { Button, Text, Center } from 'native-base';
import ScrollViewWithWorkouts from './ScrollViewWithWorkouts';
import AddWorkoutModal from './AddWorkoutModal';
import { workout } from '../utils/Interfaces';
import { useAppSelector } from '../redux/hooks';

// TODO: add typing for route and navigation
export default function DailyPage({ route, navigation }): JSX.Element {
  const { day }: { day: string } = route.params;
  const workouts: workout[] = useAppSelector(state => state.workoutsReducer.daysToWorkouts[day]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  return (
    <>
      {workouts.length > 0 ? (
        <ScrollViewWithWorkouts workouts={workouts}></ScrollViewWithWorkouts>
      ) : (
        <Center flex={1}>
          <Text variant={'noWorkouts'}>No workouts added! Click "+" at the bottom to add workouts!</Text>
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
