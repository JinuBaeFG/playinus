import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../color";
import { RootStackParamList } from "../shared.types";

type UserRowCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Likes"
>;

export interface IUserRowsProps {
  avatar: string;
  username: string;
  isFollowing: boolean;
  isMe: boolean;
  id: number;
}

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 26px;
  margin-right: 10px;
`;
const Username = styled.Text`
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
`;
const FollowBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  padding: 5px 10px;
  border-radius: 4px;
`;
const FollowBtnText = styled.Text`
  color: ${(props) => props.theme.textColor};
`;

export default function UserRow({
  avatar,
  username,
  isFollowing,
  isMe,
  id,
}: IUserRowsProps) {
  const navigation = useNavigation<UserRowCompNavigationProps>();
  return (
    <Wrapper>
      <Column
        onPress={() => {
          navigation.navigate("Profile", {
            username,
            id,
          });
        }}
      >
        <Avatar source={{ uri: avatar }} />
        <Username>{username}</Username>
      </Column>
      {!isMe ? (
        <FollowBtn>
          <FollowBtnText>{isFollowing ? "Unfollow" : "Follow"}</FollowBtnText>
        </FollowBtn>
      ) : null}
    </Wrapper>
  );
}
