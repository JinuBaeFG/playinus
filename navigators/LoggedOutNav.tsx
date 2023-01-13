import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useColorScheme } from "react-native";
import CreateAccount from "../screens/CreateAccount";
import Login from "../screens/Login";
import Welcome from "../screens/Welcome";

const Stack = createStackNavigator();

export default function LoggedOutNav() {
  const isDark = useColorScheme() === "dark";
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: () => false,
        headerTransparent: true,
        headerTintColor: isDark ? "#ffffff" : "#1e272e",
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
}
