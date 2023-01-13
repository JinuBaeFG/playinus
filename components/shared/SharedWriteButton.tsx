import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";

type UploadCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "SharedWriteButton"
>;

const WriteButtonContainer = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${(props) => props.theme.greenActColor};
  align-items: center;
  justify-content: center;
`;

export default function SharedWriteButton() {
  const navigation = useNavigation<UploadCompNavigationProps>();
  const getName = navigation.getState().routes.map((item) => {
    return item.name;
  });
  const screenName = getName[0].toString();

  const onPress = () => {
    if (screenName === "TabFeed") {
      return navigation.navigate("AddFeed", { screenName });
    } else if (screenName === "TabGroup") {
      return navigation.navigate("AddGroup", { screenName });
    } else if (screenName === "TabTutor") {
      return navigation.navigate("AddTutor", { screenName });
    } else if (screenName === "TabFacility") {
      return navigation.navigate("AddFacility", { screenName });
    }
  };

  return (
    <WriteButtonContainer onPress={() => onPress()}>
      <Ionicons name={"ios-add"} size={28} color="white" />
    </WriteButtonContainer>
  );
}
