import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  View,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  useColorScheme,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import DissmissKeyboard from "../components/DismissKeyboard";

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const MessageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const MessageText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const Input = styled.TextInput<{ width: number }>`
  background-color: ${(props) => props.theme.mainBgColor};
  color: ${(props) => props.theme.textColor};
  width: ${(props) => props.width / 1.5}px;
  padding: 5px 10px;
  border-radius: 4px;
`;

export default function Search({ navigation }: any) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);
  const onValid = ({ keyword }: any) => {
    startQueryFn({
      variables: {
        keyword,
      },
    });
  };
  const SearchBox = () => {
    return (
      <Input
        width={width}
        placeholderTextColor="rgba(0, 0, 0, 0.8)"
        placeholder="Search..."
        autoCapitalize="none"
        returnKeyLabel="Search"
        returnKeyType="search"
        autoCorrect={false}
        onChangeText={(text: string) => setValue("keyword", text)}
        onSubmitEditing={handleSubmit(onValid)}
      />
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword", {
      required: true,
      minLength: 3,
    });
  }, []);
  const renderItem = ({ item: photo }: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Photo", { photoId: photo.id })}
      >
        <Image
          source={{ uri: photo.file }}
          style={{ width: width / numColumns, height: width / numColumns }}
        />
      </TouchableOpacity>
    );
  };
  const isDark = useColorScheme() === "dark";
  return (
    <DissmissKeyboard>
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? "#1e272e" : "#ffffff",
        }}
      >
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" color={"white"} />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos?.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              numColumns={numColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => "" + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </View>
    </DissmissKeyboard>
  );
}
