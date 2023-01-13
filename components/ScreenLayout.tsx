import React from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import styled from "styled-components/native";

const ScreenLayoutContiner = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.grayInactColor};
`;

export default function ScreenLayout({ loading, children }: any) {
  const isDark = useColorScheme() === "dark";
  return (
    <ScreenLayoutContiner>
      {loading ? <ActivityIndicator color="white" /> : children}
    </ScreenLayoutContiner>
  );
}
