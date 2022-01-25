// Represents an individual workout to be displayed
export interface workout {
  name: string;
  reps: string;
  lastWorkoutWeight: number | null;
  workoutLink: string | null;
  notes: string | null;
  type: string;
}
