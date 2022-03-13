import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Workout from './Workout';
import { workout } from '../utils/Interfaces';

export default function ScrollViewWithWorkouts({ workouts }: { workouts: workout[] }): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {workouts.map((w, idx) => (
        <Workout delay={idx} workout={w} key={idx}></Workout>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    alignItems: 'center',
  },
});
