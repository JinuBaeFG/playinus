import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import {
  PHOTO_FRAGMENT_NATIVE,
  COMMENT_FRAGMENT_NATIVE,
} from "../../fragments";
import { RootStackParamList } from "../../shared.types";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";

const FEED_DETAIL_QUERY = gql`
  query seePhoto($id: Int) {
    seePhoto(id: $id) {
      ...PhotoFragmentNative
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragmentNative
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT_NATIVE}
  ${COMMENT_FRAGMENT_NATIVE}
`;

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "PhotoDetail"
>;

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

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  width: 100%;
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

export default function Detail({ route }: any) {
  const { data, loading } = useQuery(FEED_DETAIL_QUERY, {
    variables: {
      id: route.params.id,
    },
  });
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
      const photoId = `Photo:${data?.seePhoto?.id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (data?.seePhoto?.isLiked) {
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
        id: data?.seePhoto?.id,
      },
      update: updateToggleLike,
    }
  );
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: data?.seePhoto?.user.username,
      id: data?.seePhoto?.user.id,
    });
  };

  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar
          resizeMode="cover"
          source={
            data?.seePhoto?.user.avatar === null
              ? require(`../../assets/emptyAvatar.png`)
              : { uri: data?.seePhoto?.user.avatar }
          }
        />
        <Username>{data?.seePhoto?.user.username}</Username>
      </Header>
      <Caption>
        <CaptionText>{data?.seePhoto?.caption}</CaptionText>
      </Caption>
      {data?.seePhoto?.files.length > 0 ? (
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
            {data?.seePhoto?.files.map((file: any, index: any) => (
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
        <Likes>좋아요 {data?.seePhoto?.likes}</Likes>
        <CommentNumber>댓글 {data?.seePhoto?.commentNumber}</CommentNumber>
      </NumberContainer>
      <ExtraContainer>
        <Actions>
          <Action
            onPress={() =>
              navigation.navigate("Comments", {
                id: data?.seePhoto?.id,
              })
            }
          >
            <Ionicons
              name="chatbubble-outline"
              color={"rgba(136, 136, 136, 0.4)"}
              style={{ marginBottom: 2 }}
              size={16}
            />
            <ActionText>댓글 달기</ActionText>
          </Action>
          <Action onPress={() => toggleLikeMutation()}>
            <Ionicons
              name={data?.seePhoto?.isLiked ? "heart" : "heart-outline"}
              color={
                data?.seePhoto?.isLiked ? "tomato" : "rgba(136, 136, 136, 0.4)"
              }
              size={20}
            />
            <ActionText>좋아요</ActionText>
          </Action>
        </Actions>
      </ExtraContainer>
    </Container>
  );
}
