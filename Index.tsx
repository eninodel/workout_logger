import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyPage from "./components/DailyPage";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SSRProvider } from "@react-aria/ssr";
import * as SQLite from "expo-sqlite";
import { createInitialTables, exampleWorkout, insertExampleWorkout } from "./SQLStatements";
import { useAppDispatch } from "./hooks";
import { getWorkouts} from "./SQLHelpers";
import AppLoading from "expo-app-loading";
import DatabaseCaller from "./components/DatabaseCaller";
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstructionsModal from "./components/InstructionsModal";


const db = SQLite.openDatabase("workouts.db");

const firstAppStartup = async (): Promise<boolean> => {
  // await AsyncStorage.removeItem("FIRST_STARTUP");
  try {
    const value = await AsyncStorage.getItem('FIRST_STARTUP')
    if(value !== null) {
      // not first startup
      return false;
    } else{
      // first startup
      await AsyncStorage.setItem("FIRST_STARTUP", "false")
      return true;
    }
  } catch(e) {
    // error reading value
  }

  return false;
}

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const mainBackgroundColor  = 'rgb(45, 45, 45)';

  const navigationTheme = {
    ...DefaultTheme,
    colors:{
      ...DefaultTheme.colors,
      primary: "rgb(255,255,255)",
      background: mainBackgroundColor,
      card: mainBackgroundColor,
      text: "rgb(255,255,255)",
    }
  }

  const nativeBaseTheme = extendTheme({
    components: {
      Text: {
        variants: {
          noWorkouts : {
            color: "rgb(255,255,255)",
          },
          workout: {
            color: mainBackgroundColor
          },
          error: {
            color: "rgb(255, 15, 63)",
            fontSize:10
          }
        },
      },
      Button: {
        defaultProps: {
          colorScheme: mainBackgroundColor
        }
      },
      Radio : {
        defaultProps: {
          colorScheme: mainBackgroundColor
        }
      }
    }
  })
  
  const appStartup = async()=>{
    if (await firstAppStartup() === true){
      await Promise.all(createInitialTables.map(async (sql)=>{
        return new Promise((res, rej) => {
          db.transaction(
            (tx) =>
              tx.executeSql(sql, [], (tx, resultSet) => {
                // console.log(resultSet.rows._array)
                res("success")
              }),
            (e) => console.log("error in app.tx with sql: "+ sql + e.message)
          );
        })
      }));
      await db.transaction((tx) => {
        tx.executeSql(exampleWorkout,[],(tx, resultSet) => {

        })
      },(e) => console.log("error in adding example workout: " + e.message))
      await db.transaction((tx) => {
        tx.executeSql(insertExampleWorkout)
      }, (e) => console.log("error in inserting example workout to days: " + e.message))
    }
    getWorkouts(db, setIsLoading, dispatch);
  }

  useEffect(() => {
    appStartup();
  });

  const Tab = createMaterialTopTabNavigator();

  // Gets and returns current day of the week.
  const getCurrentDay = (): string => {
    const daysOfWeek: Array<string> = ["S", " M", "T", "W", "TH", "F", "SA"];
    const d = new Date().getDay();
    return daysOfWeek[d];
  };

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <SSRProvider>
      <NativeBaseProvider theme = {nativeBaseTheme}>
        <DatabaseCaller db={db}>
          <SafeAreaView style={{ flex: 1, backgroundColor:mainBackgroundColor }}>
            <InstructionsModal show={show} setShow={setShow}>
              <NavigationContainer theme={navigationTheme}>
                <Tab.Navigator initialRouteName={getCurrentDay()}>
                  <Tab.Screen
                    name="S"
                    component={DailyPage}
                    initialParams={{ day: "S" }}
                  />
                  <Tab.Screen
                    name="M"
                    component={DailyPage}
                    initialParams={{ day: "M" }}
                  />
                  <Tab.Screen
                    name="T"
                    component={DailyPage}
                    initialParams={{ day: "T" }}
                  />
                  <Tab.Screen
                    name="W"
                    component={DailyPage}
                    initialParams={{ day: "W" }}
                  />
                  <Tab.Screen
                    name="TH"
                    component={DailyPage}
                    initialParams={{ day: "TH" }}
                  />
                  <Tab.Screen
                    name="F"
                    component={DailyPage}
                    initialParams={{ day: "F" }}
                  />
                  <Tab.Screen
                    name="SA"
                    component={DailyPage}
                    initialParams={{ day: "SA" }}
                  />
                  </Tab.Navigator>
                </NavigationContainer>
              </InstructionsModal>
          </SafeAreaView>
        </DatabaseCaller>
      </NativeBaseProvider>
    </SSRProvider>
  );
}
