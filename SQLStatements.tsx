export const createInitialTables: string[] = [
  `PRAGMA foreign_keys = ON;`,
  `CREATE TABLE IF NOT EXISTS days (NAME TEXT NOT NULL PRIMARY KEY);`,
  `CREATE TABLE IF NOT EXISTS workouts(NAME TEXT NOT NULL PRIMARY KEY, REPS TEXT NOT NULL, NOTES TEXT, LINK TEXT, TYPE TEXT NOT NULL);`,
  `CREATE TABLE IF NOT EXISTS days_to_workouts (DAYS TEXT NOT NULL, WORKOUTS TEXT NOT NULL, PRIMARY KEY (DAYS, WORKOUTS),
  FOREIGN KEY (DAYS) REFERENCES days (NAME) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(WORKOUTS) REFERENCES workouts (NAME) ON DELETE CASCADE ON UPDATE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS workout_data (ID INTEGER NOT NULL PRIMARY KEY, WORKOUT TEXT NOT NULL, DATE TEXT NOT NULL, VALUE INT NOT NULL,
      FOREIGN KEY (WORKOUT) REFERENCES workouts (NAME) ON DELETE CASCADE ON UPDATE CASCADE);`,
];
