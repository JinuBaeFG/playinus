import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoomList from "../screens/RoomList";
import Room from "../screens/Room";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

const Stack = createStackNavigator();

export default function MessagesNav() {
  const isDark = useColorScheme() === "dark";
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: isDark ? "#ffffff" : "#1e272e",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: isDark ? "#1e272e" : "#ffffff",
        },
      }}
    >
      <Stack.Screen
        name="RoomList"
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="chevron-down" size={28} />
          ),
        }}
        component={RoomList}
      />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}
