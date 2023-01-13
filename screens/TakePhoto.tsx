import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { Camera } from "expo-camera";
import { TouchableOpacity, Image, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor}; ;
`;

const Actions = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  flex: 0.2;
  padding: 10px 48px;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.3);
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 35px;
  opacity: 0.5;
`;

const SliderContiainer = styled.View``;
const ActionsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const PhotoActions = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  flex: 0.2;
  padding: 10px 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.3);
`;

const PhotoAction = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 5px 10px;
  border-radius: 4px;
`;
const PhotoActionText = styled.Text`
  font-weight: 600;
`;

export default function TakePhoto({ navigation }: any) {
  const cameraRef = useRef<Camera | null>(new Camera({}));
  const [takenPhoto, setTakenPhoto] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    setOk(granted);
  };
  useEffect(() => {
    getPermissions();
  }, []);
  const onCameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };
  const onZoomValueChange = (e: number) => {
    setZoom(e);
  };
  const onFlashChange = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.auto);
    } else {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };
  const goToUpload = async (save: boolean) => {
    if (save) {
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
    navigation.navigate("UploadForm", {
      file: takenPhoto,
    });
  };
  const onUpload = () => {
    Alert.alert("Save Photo?", "Save Photo and Upload? or Just Upload", [
      {
        text: "Save & Upload",
        onPress: () => goToUpload(true),
      },
      {
        text: "Just Upload",
        onPress: () => goToUpload(false),
      },
    ]);
  };
  const onCameraReady = () => {
    setCameraReady(true);
  };
  const takePhoto = async () => {
    if (cameraRef.current && cameraReady) {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });
      setTakenPhoto(uri);
    }
  };
  const onDismiss = () => setTakenPhoto("");
  const isFocused = useIsFocused();
  return (
    <Container>
      {isFocused ? <StatusBar hidden={true} /> : null}
      {takenPhoto === "" ? (
        <Camera
          type={cameraType}
          ratio="16:9"
          style={{ flex: 1 }}
          zoom={zoom}
          flashMode={flashMode}
          ref={(camera) => {
            cameraRef.current = camera;
          }}
          onCameraReady={onCameraReady}
        >
          <CloseButton onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="white" />
          </CloseButton>
        </Camera>
      ) : (
        <Image source={{ uri: takenPhoto }} style={{ flex: 1 }} />
      )}
      {takenPhoto === "" ? (
        <Actions>
          <SliderContiainer>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255,255,255,0.8)"
              onValueChange={onZoomValueChange}
            />
          </SliderContiainer>
          <ButtonsContainer>
            <ActionsContainer>
              <TouchableOpacity
                onPress={onFlashChange}
                disabled={
                  cameraType === Camera.Constants.Type.front ? true : false
                }
              >
                <Ionicons
                  name={
                    flashMode === Camera.Constants.FlashMode.off
                      ? "flash-off"
                      : flashMode === Camera.Constants.FlashMode.on
                      ? "flash"
                      : flashMode === Camera.Constants.FlashMode.auto
                      ? "eye"
                      : ""
                  }
                  color={
                    cameraType === Camera.Constants.Type.front
                      ? "rgba(0, 0, 0, 0.5)"
                      : "white"
                  }
                  size={24}
                />
              </TouchableOpacity>
              <TakePhotoBtn onPress={takePhoto} />
              <TouchableOpacity onPress={onCameraSwitch}>
                <Ionicons
                  name={
                    cameraType === Camera.Constants.Type.front
                      ? "camera-reverse"
                      : "camera"
                  }
                  color="white"
                  size={24}
                />
              </TouchableOpacity>
            </ActionsContainer>
          </ButtonsContainer>
        </Actions>
      ) : (
        <PhotoActions>
          <PhotoAction onPress={onDismiss}>
            <PhotoActionText>Dismiss</PhotoActionText>
          </PhotoAction>
          <PhotoAction onPress={onUpload}>
            <PhotoActionText>Upload</PhotoActionText>
          </PhotoAction>
        </PhotoActions>
      )}
    </Container>
  );
}
