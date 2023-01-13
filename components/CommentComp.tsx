import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../shared.types";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

interface ICommentCompProps {
  id: number;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  payload: string;
  isMine: boolean;
  createdAt: string;
}

type CommentCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Comments"
>;

const CommentContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: flex-start;
  padding: 8px 0;
`;

const CommentText = styled.Text`
  margin-left: 48px;
  color: ${(props) => props.theme.textColor};
`;

const Header = styled.View`
  width: 100%;
  padding: 12px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50px;
`;
const UserInfo = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;
const Info = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const UserLocation = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 600;
`;
const UpdateTime = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 600;
`;
const Dotted = styled.View`
  width: 2px;
  height: 2px;
  background-color: ${(props) => props.theme.grayColor};
  margin: 0px 4px;
  border-radius: 1px;
`;

const ActionWrapper = styled.View`
  margin: 8px 0 0 48px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const Actions = styled.TouchableOpacity`
  margin-right: 8px;
`;

const Likes = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const ReComment = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const CommentEdit = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const CommentDelete = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

export default function CommentComp({
  id,
  user,
  payload,
  isMine,
  createdAt,
}: ICommentCompProps) {
  const navigation = useNavigation<CommentCompNavigationProps>();
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user.username,
      id: user.id,
    });
  };
  const updateTime = Number(createdAt);
  const date = new Date(updateTime);

  return (
    <CommentContainer>
      <Header>
        <TouchableOpacity onPress={() => goToProfile()}>
          <UserAvatar resizeMode="cover" source={{ uri: user.avatar }} />
        </TouchableOpacity>
        <UserInfo>
          <TouchableOpacity onPress={() => goToProfile()}>
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <Info>
            <UserLocation>임시</UserLocation>
            <Dotted />
            <UpdateTime>{dateTime(date)}</UpdateTime>
          </Info>
        </UserInfo>
      </Header>
      <CommentText>{payload}</CommentText>
      <ActionWrapper>
        {isMine ? null : (
          <Actions>
            <Likes>좋아요</Likes>
          </Actions>
        )}
        <Actions>
          <ReComment>답글쓰기</ReComment>
        </Actions>
        {isMine ? (
          <Actions>
            <CommentEdit>수정하기</CommentEdit>
          </Actions>
        ) : null}
        {isMine ? (
          <Actions>
            <CommentDelete>삭제하기</CommentDelete>
          </Actions>
        ) : null}
      </ActionWrapper>
    </CommentContainer>
  );
}

function dateTime(date: Date) {
  const currentTime = new Date().getTime();
  const updateTime = new Date(date).getTime();
  const timeDiff = currentTime - updateTime;
  const timeDiffSec = Math.floor(timeDiff / 1000);
  const timeDiffMin = Math.floor(timeDiffSec / 60);
  const timeDiffHour = Math.floor(timeDiffMin / 60);
  const timeDiffDay = Math.floor(timeDiffHour / 24);
  const updateYear = date.getFullYear();
  const updateMon = date.getMonth();
  const updateDay = date.getDay();

  if (timeDiffSec < 60) {
    return "방금 전";
  } else if (timeDiffMin < 60) {
    return timeDiffMin + "분 전";
  } else if (timeDiffHour < 24) {
    return timeDiffHour + "시간 전";
  } else if (timeDiffDay > 0) {
    return updateYear + "년 " + updateMon + "월 " + updateDay + "일";
  }
}
