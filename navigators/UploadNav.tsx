import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { useColorScheme } from "react-native";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function UploadNav() {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: { backgroundColor: isDark ? "#1e272e" : "#ffffff" },
        tabBarActiveTintColor: isDark ? "#ffffff" : "#1e272e",
        tabBarIndicatorStyle: {
          backgroundColor: isDark ? "#1e272e" : "#ffffff",
          top: 0,
        },
      }}
    >
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerTintColor: isDark ? "#ffffff" : "#1e272e",
              headerBackTitleVisible: false,
              headerBackImage: ({ tintColor }) => (
                <Ionicons color={tintColor} name="close" size={28} />
              ),
              headerStyle: {
                backgroundColor: isDark ? "#1e272e" : "#ffffff",
                shadowOpacity: 0.3,
              },
            }}
          >
            <Stack.Screen
              name="StackSelect"
              options={{ title: "Choose a Photo" }}
              component={SelectPhoto}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
}
