import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, Text } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import CommentComp from "../components/CommentComp";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hooks/useMe";
import {
  createComment,
  createCommentVariables,
} from "../__generated__/createComment";
import { seeFeed_seeFeed_comments } from "../__generated__/seeFeed";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const PHOTO_COMMENTS_QUERY = gql`
  query seePhotoComments($id: Int!) {
    seePhotoComments(id: $id) {
      id
      user {
        id
        username
        avatar
      }
      payload
      isMine
      createdAt
    }
  }
`;

const MessageInput = styled.TextInput`
  background-color: black;
  padding: 10px 20px;
  color: white;
  border-radius: 1000px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  width: 85%;
  margin-right: 10px;
`;

const InputContainer = styled.View`
  margin: 15px 0;
  width: 95%;
  flex-direction: row;
  align-items: center;
`;

const SendButton = styled.TouchableOpacity``;

export default function Comments({ navigation, route }: any) {
  const photoId = route.params.id;
  // 댓글달기
  const { data: userData } = useMe();
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<createCommentVariables>();
  const createCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      // 새로 작성한 댓글을 캐시에 저장(작성)
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment newComment on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });
      // 피드에 새로 작성되어 캐시에 저장된 댓글을 업데이트
      cache.modify({
        id: `Photo:${id}`,
        fileds: {
          newComments(prev: seeFeed_seeFeed_comments[]) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev: number) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createCommentMutation, { loading: newCommentloading }] = useMutation<
    createComment,
    createCommentVariables
  >(CREATE_COMMENT_MUTATION, { update: createCommentUpdate });
  const onValid: SubmitHandler<createCommentVariables> = (data) => {
    const { payload } = data;
    if (newCommentloading) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };

  // 댓글 목록 가져오기
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    loading: listLoading,
    refetch,
  } = useQuery(PHOTO_COMMENTS_QUERY, {
    variables: {
      id: photoId,
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const commentList = ({ item: comment }: any) => {
    return <CommentComp {...comment} />;
  };

  useEffect(() => {
    register("payload", {
      required: true,
      minLength: 3,
    });
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 160 : 125}
    >
      <ScreenLayout loading={listLoading}>
        <FlatList
          style={{
            width: "100%",
          }}
          refreshing={refreshing}
          onRefresh={refresh}
          data={data?.seePhotoComments}
          keyExtractor={(comment) => "" + comment.id}
          renderItem={commentList}
        />

        <InputContainer>
          <MessageInput
            placeholderTextColor="rgba(255,255,255,0.5)"
            placeholder="Write..."
            returnKeyLabel="Done"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text) => setValue("payload", text)}
            value={watch("payload")}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("payload"))}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("payload"))
                  ? "rgba(255, 255, 255, 0.5)"
                  : "white"
              }
              size={20}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
