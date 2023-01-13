import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useForm } from "react-hook-form";
import useMe from "../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";
import { cache } from "../apollo";

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

const MessageContainer = styled.View<{ outGoing: boolean }>`
  padding: 10px;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
`;
const Author = styled.View``;
const Avatar = styled.Image`
  width: 28px;
  height: 28px;
  border-radius: 14px;
`;
const Username = styled.Text`
  color: white;
`;
const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0px 10px;
  font-size: 16px;
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

export default function Room({ route, navigation }: any) {
  const { data: meData } = useMe();
  const { register, setValue, handleSubmit, getValues, watch } = useForm();
  const updateSendMessage = (cache: any, result: any) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        payload: message,
        user: {
          username: meData.me.username,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: "Message",
      };
      // 새로 작성된 메세지를 캐시에 저장(작성)
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });
      // 해당 채팅방에 새로 작성되어 캐시에 저장된 메세지를 업데이트 (DB에 보내지기 전에)
      cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev: any) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const [sendMessageMutation, { loading: sendingLoading }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });

  const client = useApolloClient();

  const updateQuery = (prevQuery: any, options: any) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;

    if (message.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: message,
      });

      // 해당 채팅방에 새로 작성되어 캐시에 저장된 메세지를 업데이트
      client.cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev: any) {
            const existingMessage = prev.find(
              (aMessage: any) => aMessage.__ref === incomingMessage?.__ref
            );
            if (existingMessage) {
              return prev;
            }

            return [...prev, incomingMessage];
          },
        },
      });
    }
  };
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    if (data?.seeRoom && !subscribed) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);

  const onValid = ({ message }: any) => {
    if (!sendingLoading) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route?.params?.id,
        },
      });
    }
  };

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.talkingTo?.username,
    });
  }, []);
  const renderItem = ({ item: message }: any) => {
    return (
      <MessageContainer
        outGoing={message.user.username !== route?.params?.talkingTo?.username}
      >
        <Author>
          <Avatar source={{ uri: message.user.avatar }} />
          <Username>{message.user.username}</Username>
        </Author>
        <Message>{message.payload}</Message>
      </MessageContainer>
    );
  };
  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 75}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          inverted
          style={{ width: "100%", marginVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }}></View>}
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <InputContainer>
          <MessageInput
            placeholderTextColor="rgba(255,255,255,0.5)"
            placeholder="Write..."
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text) => setValue("message", text)}
            value={watch("message")}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("message"))}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("message"))
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
