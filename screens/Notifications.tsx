import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

const NotificationContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NotificationText = styled.Text`
  color: ${(props) => props.theme.textColor};
`;

export default function Notifications() {
  return (
    <NotificationContainer>
      <NotificationText>Notifications</NotificationText>
    </NotificationContainer>
  );
}
