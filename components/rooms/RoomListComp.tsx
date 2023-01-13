import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../../color";
import useMe from "../../hooks/useMe";
import { RootStackParamList } from "../../shared.types";

type RoomCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Room"
>;

const RoomContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 15px 10px;
  align-items: center;
  justify-content: space-between;
`;
const RoomText = styled.Text`
  color: ${(props) => props.theme.textColor};
`;

const Column = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 20px;
`;
const Data = styled.View``;
const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colors.blue};
`;
const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  font-size: 16px;
`;
const UnreadText = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin-top: 4px;
  font-weight: 500;
`;

export default function RoomComp({ users, unreadTotal, id }: any) {
  const { data: meData } = useMe();
  const navigation = useNavigation<RoomCompNavigationProps>();
  const talkingTo = users.find(
    (user: any) => user.username !== meData?.me?.username
  );
  const goToRoom = () =>
    navigation.navigate("Room", {
      id,
      talkingTo: talkingTo,
    });
  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatar source={{ uri: talkingTo.avatar }} />
        <Data>
          <Username>{talkingTo.username}</Username>
          {unreadTotal !== 0 ? (
            <UnreadText>{unreadTotal} 읽지 않음</UnreadText>
          ) : null}
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 ? <UnreadDot /> : null}</Column>
    </RoomContainer>
  );
}
