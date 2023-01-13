import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TabsNav from "./TabsNav";
import { Ionicons } from "@expo/vector-icons";
import MessagesNav from "./MessagesNav";
import { useColorScheme } from "react-native";
import Notifications from "../screens/Notifications";
import AddFeed from "../screens/Feed/AddFeed";
import AddGroup from "../screens/Group/AddGroup";

const Stack = createStackNavigator();

export default function LoggedInNav() {
  const isDark = useColorScheme() === "dark";
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
      }}
    >
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={TabsNav}
      />
      <Stack.Screen
        name={"Notifications"}
        options={{ headerShown: false }}
        component={Notifications}
      />
      <Stack.Screen
        name="Messages"
        options={{ headerShown: false }}
        component={MessagesNav}
      />
      <Stack.Screen
        name="AddFeed"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "피드추가",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={AddFeed}
      />
      <Stack.Screen
        name="AddGroup"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "그룹만들기",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={AddGroup}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        getComponent={() => require("../screens/Profile/Profile").default}
      />
    </Stack.Navigator>
  );
}
