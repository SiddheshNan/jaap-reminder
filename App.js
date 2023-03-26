import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons, Entypo, FontAwesome } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import HomePage from "./screens/HomePage";
import AddNew from "./screens/AddNew";
import Mantras from "./screens/Mantras";
import HistoryList from "./screens/History";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="HomePage"
            barStyle={{ backgroundColor: "#FFD966", height: 75, paddingTop: 0 }}
          >
            <Tab.Screen
              name="HomePage"
              component={HomePage}
              options={{
                tabBarLabel: "आजचे जप",
                tabBarIcon: () => <Ionicons name="today-sharp" size={20} />,
              }}
            />

            <Tab.Screen
              name="HistoryList"
              component={HistoryList}
              options={{
                tabBarLabel: "संपादन",
                tabBarIcon: () => <Entypo name="pencil" size={20} />,
              }}
            />

            <Tab.Screen
              name="Mantras"
              component={Mantras}
              options={{
                tabBarLabel: "मंत्रे",
                tabBarIcon: () => <Entypo name="text-document" size={20} />,
              }}
            />

            <Tab.Screen
              name="AddNew"
              component={AddNew}
              options={{
                tabBarLabel: "नवीन",
                tabBarIcon: () => <Entypo name="add-to-list" size={20} />,
              }}
            />
          </Tab.Navigator>

          {/* <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="HomePage"
          >
            <Stack.Screen
              name="HomePage"
              component={HomePage}
              options={{ animation: "default" }}
            />

            <Stack.Screen
              name="AddNew"
              component={AddNew}
              options={{ animation: "default" }}
            />

          </Stack.Navigator> */}
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
