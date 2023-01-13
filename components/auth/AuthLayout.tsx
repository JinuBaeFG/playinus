import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 0px 20px;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

export default function AuthLayout({ children }: any) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const isDark = useColorScheme() === "dark";
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}
    >
      <Container>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -50}
        >
          <Logo
            resizeMode="contain"
            source={
              isDark
                ? require("../../assets/white_logo.png")
                : require("../../assets/logo.png")
            }
          />
          {children}
        </KeyboardAvoidingView>
      </Container>
    </TouchableWithoutFeedback>
  );
}
