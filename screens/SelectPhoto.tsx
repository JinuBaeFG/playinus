import React, { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../color";
import { StatusBar } from "expo-status-bar";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Top = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Bottom = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

export default function SelectPhoto({ navigation }: any) {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [chosenPhoto, setChosenPhoto] = useState("");
  const [localPhoto, setLocalPhoto] = useState<string | undefined>("");
  const getPhotos = async () => {
    if (ok) {
      const { assets: photo } = await MediaLibrary.getAssetsAsync();
      setPhotos(photo);
      setChosenPhoto(photo[0]?.uri);
    }
  };
  const getPermissions = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    // 사진 갤러리 권한 허용을 위한 확인
    if (status === "undetermined" && canAskAgain) {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "undetermined") {
        // 권한 요청 후 권한이 부여된 상태면 상태값 true
        setOk(true);
        getPhotos();
      }
    } else if (status !== "undetermined") {
      // 권한이 부여된 상태인 경우 상태값 true
      setOk(true);
      getPhotos();
    }
  };
  useEffect(() => {
    getPermissions();
  }, [ok]);

  const HeaderRight = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("UploadForm", { file: localPhoto })}
      >
        <HeaderRightText>Next</HeaderRightText>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [chosenPhoto]);

  const numColumns = 4;
  const { width } = useWindowDimensions();
  const choosePhoto = async (id: any) => {
    const info = await MediaLibrary.getAssetInfoAsync(id);
    setLocalPhoto(info.localUri);
    setChosenPhoto(info.uri);
  };
  const renderItem = ({ item: photo }: any) => {
    return (
      <ImageContainer onPress={() => choosePhoto(photo.id)}>
        <Image
          source={{ uri: photo.uri }}
          style={{ width: width / 4, height: width / 4 }}
        />
        <IconContainer>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={photo.uri === chosenPhoto ? colors.blue : "white"}
          />
        </IconContainer>
      </ImageContainer>
    );
  };
  return (
    <Container>
      <StatusBar hidden={false} />
      <Top>
        {chosenPhoto !== "" ? (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
        />
      </Bottom>
    </Container>
  );
}
