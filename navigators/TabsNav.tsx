import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, useColorScheme, View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import useMe from "../hooks/useMe";
import StackNavFactroy from "./SharedStackNav";

interface ITabsNavProps {
  screenName: string;
}

const Tabs = createBottomTabNavigator();

export default function TabsNav() {
  const { data } = useMe();
  const isDark = useColorScheme() === "dark";
  return (
    <Tabs.Navigator
      screenOptions={{
        headerTitle: () => false,
        headerShown: false,
        headerTransparent: true,
        tabBarStyle: {
          backgroundColor: isDark ? "#1e272e" : "#ffffff",
          borderTopColor: "rgba(255,255,255,0.5)",
        },
        tabBarActiveTintColor: isDark ? "#ffffff" : "#1e272e",
      }}
    >
      <Tabs.Screen
        name="홈"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"home"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactroy screenName="Home" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="동네소식"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"list"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactroy screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="그룹"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"people"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactroy screenName="Group" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="시설/튜터"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"calendar"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactroy screenName="Tutor" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="내 Gym"
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            data?.me?.avatar ? (
              <Image
                source={{ uri: data.me.avatar }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  ...(focused && { borderColor: "white", borderWidth: 1 }),
                }}
              />
            ) : (
              <TabIcon iconName={"person"} color={color} focused={focused} />
            ),
        }}
      >
        {() => <StackNavFactroy screenName="MyProfile" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}
