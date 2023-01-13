import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";

const Button = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${colors.blue};
  padding: 12px 8px;
  border-radius: 4px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;
const ButtonText = styled.Text`
  color: ${(props) => props.theme.textColor};
  text-align: center;
  font-weight: 600;
`;

export default function AuthButton({ onPress, disabled, text, loading }: any) {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
}
