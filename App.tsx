import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import DailyPage from "./components/DailyPage";
import { NativeBaseProvider } from "native-base";
import { SSRProvider } from "@react-aria/ssr";
import Test from "./components/Test";

export default function App() {
  const Tab = createMaterialTopTabNavigator();

  const getCurrentDay = (): string => {
    const daysOfWeek: Array<string> = ["S", " M", "T", "W", "Th", "F", "Sa"];
    const d = new Date().getDay();
    return daysOfWeek[d];
  };

  return (
    <SSRProvider>
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
                name="Th"
                component={DailyPage}
                initialParams={{ day: "Th" }}
              />
              <Tab.Screen
                name="F"
                component={DailyPage}
                initialParams={{ day: "F" }}
              />
              <Tab.Screen
                name="Sa"
                component={DailyPage}
                initialParams={{ day: "Sa" }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </NativeBaseProvider>
    </SSRProvider>
  );
}
