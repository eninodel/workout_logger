import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyPage from "./components/DailyPage";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SSRProvider } from "@react-aria/ssr";
import * as SQLite from "expo-sqlite";
import { createInitialTables } from "./SQLStatements";
import { useAppDispatch } from "./hooks";
import { getWorkouts } from "./SQLHelpers";
import AppLoading from "expo-app-loading";
import DatabaseCaller from "./components/DatabaseCaller";


const db = SQLite.openDatabase("workouts.db");

// Executes default sql statements at app start up
createInitialTables.forEach((sql) => {
  db.transaction(
    (tx) =>
      tx.executeSql(sql, [], (tx, resultSet) => {
      }),
    (e) => console.log("error in app.tx with sql: " + e.message)
  );
});

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const mainBackgroundColor  = 'rgb(45, 45, 45)';

  const navigationTheme = {
    ...DefaultTheme,
    colors:{
      ...DefaultTheme.colors,
      primary: 'rgb(35, 45, 85)',
      background: mainBackgroundColor,
      card: mainBackgroundColor,
      text: "rgb(255,255,255)"
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

  useEffect(() => {
    getWorkouts(db, setIsLoading, dispatch);
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
          </SafeAreaView>
        </DatabaseCaller>
      </NativeBaseProvider>
    </SSRProvider>
  );
}