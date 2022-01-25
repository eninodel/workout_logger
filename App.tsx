import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyPage from "./components/DailyPage";
import { NativeBaseProvider } from "native-base";
import { SSRProvider } from "@react-aria/ssr";
import * as SQLite from "expo-sqlite";
import { createInitialTables } from "./SQLStatements";
import { Provider } from "react-redux";
import { createStore } from "redux";
import workoutReducer from "./redux/Reducers";

const store = createStore(workoutReducer);

const db = SQLite.openDatabase("workouts.db");

// Executes default sql statements at app start up
createInitialTables.forEach((sql) => {
  db.transaction(
    (tx) =>
      tx.executeSql(sql, [], (tx, resultSet) => {
        // console.log(resultSet.rows._array);
      }),
    (e) => console.log("error in app.tx with sql: " + e.message)
  );
});

export default function App() {
  const Tab = createMaterialTopTabNavigator();

  // Gets and returns current day of the week.
  const getCurrentDay = (): string => {
    const daysOfWeek: Array<string> = ["S", " M", "T", "W", "TH", "F", "SA"];
    const d = new Date().getDay();
    return daysOfWeek[d];
  };

  return (
    <SSRProvider>
      <Provider store={store}>
        <NativeBaseProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
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
        </NativeBaseProvider>
      </Provider>
    </SSRProvider>
  );
}
