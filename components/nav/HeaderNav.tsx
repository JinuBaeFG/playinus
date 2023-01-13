import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const HeaderNavContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${(props) => props.theme.baseMargin};
`;

export default function HeaderNav({ navigation }: any) {
  const isDark = useColorScheme() === "dark";
  return (
    <HeaderNavContainer>
      <TouchableOpacity
        style={{ marginRight: 16 }}
        onPress={() => navigation.navigate("Notifications")}
      >
        <Ionicons
          name="notifications-outline"
          color={isDark ? "#ffffff" : "#1e272e"}
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
        <Ionicons
          name="paper-plane"
          color={isDark ? "#ffffff" : "#1e272e"}
          size={24}
        />
      </TouchableOpacity>
    </HeaderNavContainer>
  );
}
