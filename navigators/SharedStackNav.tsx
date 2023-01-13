import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, useColorScheme } from "react-native";
import Comments from "../screens/Comments";
import Feed from "../screens/Feed/Feed";
import Group from "../screens/Group/Group";
import Home from "../screens/Home";
import MyProfile from "../screens/Profile/MyProfile";
import Photo from "../screens/Feed/Photo";
import PhotoDetail from "../screens/Feed/PhotoDetail";
import Tutor from "../screens/Tutor/Tutor";
import JoinConfirm from "../screens/Group/JoinConfirm";
import GroupNav from "./GroupNav";
import { Ionicons } from "@expo/vector-icons";
import EditGroup from "../screens/Group/EditGroup";
import ActiveArea from "../screens/ActiveArea";

interface IStackNavFactoryProps {
  screenName: string;
}

const Stack = createStackNavigator();

export default function StackNavFactroy({ screenName }: IStackNavFactoryProps) {
  const isDark = useColorScheme() === "dark";
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "screen",
        headerBackTitleVisible: false,
        headerTintColor: isDark ? "#ffffff" : "#1e272e",
        headerStyle: {
          backgroundColor: isDark ? "#1e272e" : "#ffffff",
          borderBottomColor: "rgba(255,255,255,0.5)",
        },
      }}
    >
      {screenName === "Home" ? (
        <Stack.Screen name={"TabHome"} component={Home} />
      ) : null}
      {screenName === "Feed" ? (
        <Stack.Screen name={"TabFeed"} component={Feed} />
      ) : null}
      {screenName === "Group" ? (
        <Stack.Screen name={"TabGroup"} component={Group} />
      ) : null}
      {screenName === "Tutor" ? (
        <Stack.Screen name={"TabTutor"} component={Tutor} />
      ) : null}
      {screenName === "MyProfile" ? (
        <Stack.Screen name={"My Profile"} component={MyProfile} />
      ) : null}
      <Stack.Screen
        name="Profile"
        getComponent={() => require("../screens/Profile/Profile").default}
      />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen
        name="Likes"
        getComponent={() => require("../screens/Likes").default}
      />
      <Stack.Screen name="PhotoDetail" component={PhotoDetail} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="GroupDetail" component={GroupNav} />
      <Stack.Screen name="JoinConfirm" component={JoinConfirm} />
      <Stack.Screen name="EditGroup" component={EditGroup} />
      <Stack.Screen name="ActiveArea" component={ActiveArea} />
    </Stack.Navigator>
  );
}
