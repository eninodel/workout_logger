export const createInitialTablesStatement: string[] = [
  `PRAGMA foreign_keys = ON;`,
  `CREATE TABLE IF NOT EXISTS days (NAME TEXT NOT NULL PRIMARY KEY);`,
  `CREATE TABLE IF NOT EXISTS workouts(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL UNIQUE, REPS TEXT NOT NULL, NOTES TEXT, LINK TEXT, TYPE TEXT NOT NULL);`,
  `CREATE TABLE IF NOT EXISTS days_to_workouts (ID INTEGER PRIMARY KEY AUTOINCREMENT, DAYS TEXT NOT NULL, WORKOUTS INTEGER NOT NULL,
 UNIQUE(DAYS, WORKOUTS),
FOREIGN KEY (DAYS) REFERENCES days (NAME) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(WORKOUTS) REFERENCES workouts (ID) ON DELETE CASCADE ON UPDATE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS workout_data (ID INTEGER PRIMARY KEY AUTOINCREMENT, WORKOUT INTEGER NOT NULL, DATE TEXT NOT NULL, VALUE INT NOT NULL,
    FOREIGN KEY (WORKOUT) REFERENCES workouts (ID) ON DELETE CASCADE ON UPDATE CASCADE);`,
  `INSERT INTO days (NAME) VALUES
    ("S"),
    ("M"),
    ("T"),
    ("W"),
    ("TH"),
    ("F"),
    ("SA");`,
];

export const exampleWorkoutStatement = `INSERT INTO workouts (NAME, REPS, NOTES, LINK, TYPE) VALUES 
  ("Power Clean",
  "3x10",
  "This is an example workout. Hold me to edit/delete,tap me to log a workout, and double tap to access the tutorial link!",
  "https://www.youtube.com/watch?v=GVt4uQ0sDJE",
  "WEIGHT");`;

export const insertExampleWorkoutStatement = `INSERT INTO days_to_workouts (DAYS, WORKOUTS) SELECT days.NAME, ID FROM days LEFT JOIN workouts WHERE workouts.NAME == "Power Clean";`;
