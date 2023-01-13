import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  Image,
  Text,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../shared.types";
import { gql, useMutation } from "@apollo/client";
import Swiper from "react-native-swiper";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Feed"
>;

interface IPhotoCompProps {
  id: number;
  user: {
    id: number;
    avatar: string;
    username: string;
  };
  caption: string;
  files: {
    map: any;
    id: number;
    fileUrl: string;
    length: number;
  };
  isLiked: boolean;
  likes: number;
  commentNumber: number;
  comments: {
    id: number;
    user: {
      id: number;
      username: string;
      avatar: string;
    };
    payload: string;
    isMine: boolean;
    createdAt: string;
  };
}

interface toggleLike_toggleLike {
  ok: boolean;
  error: string | undefined;
}

interface toggleLike {
  toggleLike: toggleLike_toggleLike;
}

interface toggleLikeVariables {
  id: number;
}

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
`;
const Header = styled.TouchableOpacity`
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
const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 4px;
`;
const Action = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const ActionText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.grayInactColor};
  margin-left: 4px;
`;
const Caption = styled.View`
  flex-direction: row;
  padding: 16px;
`;
const CaptionText = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.textColor};
`;
const Likes = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  margin: 8px 4px;
  font-weight: 600;
`;

const CommentNumber = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  margin: 8px 4px;
  font-weight: 600;
`;

const ExtraContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const NumberContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
`;

export default function PhotoComp({
  id,
  user,
  caption,
  files,
  isLiked,
  likes,
  commentNumber,
  comments,
}: IPhotoCompProps) {
  const navigation = useNavigation<PhotoCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 3);

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation<toggleLike, toggleLikeVariables>(
    TOGGLE_LIKE_MUTATION,
    {
      variables: {
        id,
      },
      update: updateToggleLike,
    }
  );
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user.username,
      id: user.id,
    });
  };
  const isDark = useColorScheme() === "dark";

  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar
          resizeMode="cover"
          source={
            user.avatar === null
              ? require(`../assets/emptyAvatar.png`)
              : { uri: user.avatar }
          }
        />
        <Username>{user.username}</Username>
      </Header>
      <TouchableOpacity
        onPress={() => navigation.navigate("PhotoDetail", { id: id })}
      >
        <Caption>
          <CaptionText>
            {caption !== null
              ? caption.length > 150
                ? caption.substring(0, 149) + "..."
                : caption
              : null}
          </CaptionText>
        </Caption>
      </TouchableOpacity>
      {files.length > 0 ? (
        <>
          <Swiper
            loop
            horizontal
            showsButtons={false}
            showsPagination={true}
            autoplay={false}
            autoplayTimeout={3.5}
            containerStyle={{
              paddingBottom: 20,
              marginBottom: 30,
              width: "100%",
              height: height / 3,
            }}
            paginationStyle={{
              position: "absolute",
              bottom: 0,
            }}
          >
            {files.map((file: any, index: any) => (
              <File
                resizeMode="cover"
                style={{
                  width,
                  height: imageHeight,
                }}
                source={{ uri: file.fileUrl }}
                key={index}
              />
            ))}
          </Swiper>
        </>
      ) : null}

      <NumberContainer>
        <Likes>좋아요 {likes}</Likes>
        <CommentNumber>댓글 {commentNumber}</CommentNumber>
      </NumberContainer>
      <ExtraContainer>
        <Actions>
          <Action onPress={() => navigation.navigate("Comments", { id: id })}>
            <Ionicons
              name="chatbubble-outline"
              color={isDark ? "#ffffff" : "#1e272e"}
              style={{ marginBottom: 2 }}
              size={16}
            />
            <ActionText>댓글 달기</ActionText>
          </Action>
          <Action onPress={() => toggleLikeMutation()}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : isDark ? "#ffffff" : "#1e272e"}
              size={20}
            />
            <ActionText>좋아요</ActionText>
          </Action>
        </Actions>
      </ExtraContainer>
    </Container>
  );
}
