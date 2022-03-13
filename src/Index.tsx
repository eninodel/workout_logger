import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyPage from './components/DailyPage';
import { NativeBaseProvider } from 'native-base';
import { SSRProvider } from '@react-aria/ssr';
import * as SQLite from 'expo-sqlite';
import {
  createInitialTablesStatement,
  exampleWorkoutStatement,
  insertExampleWorkoutStatement,
} from './utils/SQLStatements';
import { useAppDispatch } from './redux/hooks';
import { getWorkouts } from './utils/SQLHelpers';
import AppLoading from 'expo-app-loading';
import DatabaseCaller from './components/DatabaseCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstructionsModal from './components/InstructionsModal';
import { THEME } from './theme/theme';

const db = SQLite.openDatabase('workouts.db');

const firstAppStartup = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem('FIRST_STARTUP');
    if (value !== null) {
      // not first startup
      return false;
    } else {
      // first startup
      await AsyncStorage.setItem('FIRST_STARTUP', 'false');
      return true;
    }
  } catch (e) {
    // error reading value
  }

  return false;
};
const daysOfWeek: Array<string> = ['S', 'M', 'T', 'W', 'TH', 'F', 'SA'];
const getCurrentDay = (): string => {
  const d = new Date().getDay();
  return daysOfWeek[d];
};
export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const appStartup = async () => {
    if ((await firstAppStartup()) === true) {
      await Promise.all(
        createInitialTablesStatement.map(async sql => {
          return new Promise((res, rej) => {
            db.transaction(
              tx =>
                tx.executeSql(sql, [], (tx, resultSet) => {
                  // console.log(resultSet.rows._array)
                  res('success');
                }),
              e => console.log('error in app.tx with sql: ' + sql + e.message),
            );
          });
        }),
      );
      await db.transaction(
        tx => {
          tx.executeSql(exampleWorkoutStatement, [], (tx, resultSet) => {});
        },
        e => console.log('error in adding example workout: ' + e.message),
      );
      await db.transaction(
        tx => {
          tx.executeSql(insertExampleWorkoutStatement);
        },
        e => console.log('error in inserting example workout to days: ' + e.message),
      );
    }
    getWorkouts(db, setIsLoading, dispatch);
  };

  useEffect(() => {
    appStartup();
  });

  const Tab = createMaterialTopTabNavigator();

  // Gets and returns current day of the week.

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <SSRProvider>
      <NativeBaseProvider theme={THEME.nativeBaseTheme}>
        <DatabaseCaller db={db}>
          <SafeAreaView style={{ flex: 1, backgroundColor: THEME.MAINBACKGROUNDCOLOR }}>
            <InstructionsModal show={show} setShow={setShow}>
              <NavigationContainer theme={THEME.navigationTheme}>
                <Tab.Navigator initialRouteName={getCurrentDay()}>
                  {daysOfWeek.map(day => {
                    return <Tab.Screen key={day} name={day} component={DailyPage} initialParams={{ day: day }} />;
                  })}
                </Tab.Navigator>
              </NavigationContainer>
            </InstructionsModal>
          </SafeAreaView>
        </DatabaseCaller>
      </NativeBaseProvider>
    </SSRProvider>
  );
}
