// Represents an individual workout to be displayed
export interface workout {
  id: number;
  name: string;
  reps: string;
  lastWorkoutWeight: number | null;
  workoutLink: string | null;
  notes: string | null;
  type: string;
}
