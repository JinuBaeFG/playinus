import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import GroupBoard from "../screens/Group/GroupBoard";
import GroupCalendar from "../screens/Group/GroupCalendar";
import GroupInfo from "../screens/Group/GroupInfo";
import { gql, useQuery } from "@apollo/client";
import { GROUP_FRAGMENT_NATIVE } from "../fragments";
import GroupHeader from "../components/group/GroupHeader";
import ScreenLayout from "../components/ScreenLayout";

const GROUP_INFO_QUERY = gql`
  query seeGroup($id: Int!) {
    seeGroup(id: $id) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const Tab = createMaterialTopTabNavigator();

const GroupBottomContainer = styled.View`
  flex: 0.7;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 8px;
`;

export default function GroupNav({ navigation, route }: any) {
  const isDark = useColorScheme() === "dark";
  const id = route.params.id;
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    loading,
    refetch: groupNavRefetch,
  } = useQuery(GROUP_INFO_QUERY, {
    variables: {
      id,
    },
  });

  const groupNavRefresh = async () => {
    setRefreshing(true);
    await groupNavRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    groupNavRefetch();
    navigation.setOptions({
      title: data?.seeGroup?.groupname,
    });
  }, []);
  return (
    <ScreenLayout loading={loading}>
      <GroupHeader
        {...data?.seeGroup}
        navigation={navigation}
        refresh={groupNavRefresh}
      />
      <GroupBottomContainer>
        <Tab.Navigator
          tabBarPosition="top"
          screenOptions={{
            tabBarStyle: {
              backgroundColor: isDark ? "#1e272e" : "#ffffff",
            },
            tabBarActiveTintColor: isDark ? "#ffffff" : "#1e272e",
            tabBarIndicatorStyle: {
              backgroundColor: isDark ? "#1e272e" : "#ffffff",
              top: 12,
            },
          }}
        >
          <Tab.Screen
            name="GroupBoard"
            options={{
              title: "게시판",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={GroupBoard}
          />
          <Tab.Screen
            name="GroupCalendar"
            options={{
              title: "캘린더",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={GroupCalendar}
          />
          <Tab.Screen
            name="GroupInfo"
            options={{
              title: "정보",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ data: data?.seeGroup }}
            component={GroupInfo}
          />
        </Tab.Navigator>
      </GroupBottomContainer>
    </ScreenLayout>
  );
}
