import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import client from "../apollo";
import { colors } from "../color";
import DissmissKeyboard from "../components/DismissKeyboard";
import { FEED_PHOTO_NATIVE } from "../fragments";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO_NATIVE}
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 50px;
`;
const Photo = styled.Image`
  height: 350px;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

export default function UploadForm({ route, navigation }: any) {
  const updateUploadPhoto = (cache: any, result: any) => {
    const {
      data: { uploadPhoto },
    } = result;

    if (uploadPhoto.id) {
      const newFeed = client.cache.writeFragment({
        fragment: gql`
          fragment newPhoto on Photo {
            ...FeedPhotoNative
          }
          ${FEED_PHOTO_NATIVE}
        `,
        data: uploadPhoto,
      });

      cache.modify({
        id: `Photo:${uploadPhoto.id}`,
        fields: {
          seeFeed(prev: any) {
            return [newFeed, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };
  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      update: updateUploadPhoto,
    }
  );
  const HeaderRight = () => {
    return (
      <TouchableOpacity onPress={handleSubmit(onValid)}>
        <HeaderRightText>Next</HeaderRightText>
      </TouchableOpacity>
    );
  };
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    register("caption");
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, []);
  const onValid = ({ caption }: any) => {
    const file = new ReactNativeFile({
      uri: route.params.file,
      name: `1.jpg`,
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables: {
        caption,
        file,
      },
    });
  };
  return (
    <DissmissKeyboard>
      <Container>
        <Photo resizeMode="contain" source={{ uri: route.params.file }} />
        <CaptionContainer>
          <Caption
            returnKeyType="done"
            placeholder="Write..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text: string) => setValue("caption", text)}
          />
        </CaptionContainer>
      </Container>
    </DissmissKeyboard>
  );
}
