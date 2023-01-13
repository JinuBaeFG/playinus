import { gql, useMutation, useQuery } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Text,
  FlatList,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";
import DissmissKeyboard from "../../components/DismissKeyboard";
import {
  COMMENT_FRAGMENT_NATIVE,
  PHOTO_FRAGMENT_NATIVE,
} from "../../fragments";
import { SelectList } from "react-native-select-bottom-list";
import { SHOW_OPTION } from "../../shared.types";
import { Ionicons } from "@expo/vector-icons";
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($files: [Upload], $caption: String, $sortation: String) {
    uploadPhoto(files: $files, caption: $caption, sortation: $sortation) {
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

const CATEGORYLIST_QUERY = gql`
  query categoryList($offset: Int!) {
    categoryList(offset: $offset) {
      id
      hashtag
      totalPhotos
      updatedAt
    }
  }
`;

interface IFileProps {
  uri: string;
  name: string;
  type: string;
}

interface ITagProps {
  hashtag: string;
}
// Styled-Component START
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

const FeedConfigWrap = styled.View`
  background-color: ${(props) => props.theme.grayInactColor};
  color: ${(props) => props.theme.grayColor};
  padding: 8px 12px;
  border-radius: 8px;
`;

const ConfigRow = styled.View`
  padding: 4px 0;
`;

const Label = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

const UploadPhoto = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.grayInactColor};
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 16px;
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

const CaptionContainer = styled.View`
  height: 150px;
  margin-top: 16px;
`;
const Caption = styled.TextInput`
  background-color: ${(props) => props.theme.grayInactColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;
// Styled-Component END
export default function AddFeed({ route, navigation }: any) {
  // 최상위 화면명
  const screenName = route.params.screenName;

  // 카테고리 리스트 가져오기 및 공개여부 선택박스 초기화
  const { data: categoryData } = useQuery(CATEGORYLIST_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const [showSelected, setShowSelected] = useState("전체공개");
  const [showIndex, setShowIndex] = useState<number | string | undefined>(0);
  const [tagSelected, setTagSelected] = useState("");
  const [tagIndex, setTagIndex] = useState<number | string | undefined>(0);
  const getTagArray: ITagProps[] = [];

  categoryData?.categoryList.map((item: any) =>
    getTagArray.push(item?.hashtag)
  );

  // 사진 첨부 시작
  const [images, setImages] = useState([]);
  const openPicker = async () => {
    try {
      const response: any = await MultipleImagePicker.openPicker<any>({
        selectedAssets: images,
        mediaType: "image",
        usedCameraButton: false,
        isCrop: true,
        isCropCircle: true,
        maxSelectedAssets: 10,
        maximumMessageTitle: "손Gym",
        maximumMessage: "최대 등록 가능한 사진 수는 10개 입니다.",
      });
      setImages(response);
      setUploadFiles(response);
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = (value: any) => {
    const data = images.filter(
      (item: any) =>
        item?.localIdentifier &&
        item?.localIdentifier !== value?.localIdentifier
    );
    setImages(data);
    setUploadFiles(data);
  };

  const setUploadFiles = (uploadFiles: any) => {
    let files = new Array();
    uploadFiles.map((item: any) => {
      const file = new ReactNativeFile({
        uri: item.path,
        name: item.fileName,
        type: item.mime,
      });
      files.push(file);
    });
    setValue("files", files);
    files = [];
  };

  const dimensions = useWindowDimensions();
  const winWidth = dimensions.width;
  const mediaWidth = (winWidth - 52) / 3;
  const uploadPhotoItem = ({ item, index }: any) => {
    return (
      <View>
        <Image
          style={{
            width: mediaWidth,
            height: mediaWidth,
            margin: 4,
            borderRadius: 4,
          }}
          source={{
            uri: item?.path,
          }}
        />
        <TouchableOpacity onPress={() => onDelete(item)} activeOpacity={0.9}>
          <Text>삭제</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const updateUploadPhoto = (cache: any, result: any) => {
    const {
      data: { uploadPhoto },
    } = result;

    if (uploadPhoto.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev: any) {
            return [uploadPhoto, ...prev];
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
        <HeaderRightText>완료</HeaderRightText>
      </TouchableOpacity>
    );
  };
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    register("caption");
    register("files");
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, []);
  const onValid = async ({ caption, files }: any) => {
    uploadPhotoMutation({
      variables: {
        caption,
        files,
        sortation: "Feed",
      },
    });
  };
  return (
    <DissmissKeyboard>
      <Container>
        <FeedConfigWrap>
          <ConfigRow
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderBottomColor: "white",
              width: "100%",
            }}
          >
            <Label>공개여부</Label>
            <SelectList
              textStyle={{
                fontSize: 12,
                color: "#888888",
              }}
              style={{
                width: 100,
                borderStyle: undefined,
                borderColor: "rgba(136, 136, 136, 0)",
                padding: 0,
              }}
              onSelect={(item, index) => {
                setShowIndex(index);
                setShowSelected(item);
              }}
              renderIcon={() => {
                return <Ionicons name="chevron-forward" size={16} />;
              }}
              value={showSelected}
              data={SHOW_OPTION}
              listHeight={200}
            />
          </ConfigRow>
          {screenName !== "TabFeed" ? (
            <ConfigRow
              style={{
                borderBottomWidth: 1,
                borderStyle: "solid",
                borderBottomColor: "white",
                width: "100%",
              }}
            >
              <Label>어느 그룹의 글인가요?</Label>
            </ConfigRow>
          ) : null}
          <ConfigRow
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 0,
              borderStyle: "solid",
              borderBottomColor: "white",
              width: "100%",
            }}
          >
            <Label>카테고리</Label>
            <SelectList
              textStyle={{
                fontSize: 12,
                color: "#888888",
              }}
              style={{
                width: 100,
                borderStyle: undefined,
                borderColor: "rgba(136, 136, 136, 0)",
                padding: 0,
              }}
              onSelect={(item, index) => {
                setTagIndex(index);
                setTagSelected(item);
              }}
              renderIcon={() => {
                return <Ionicons name="chevron-forward" size={16} />;
              }}
              value={tagSelected}
              data={getTagArray}
              placeHolder={"선택"}
              listHeight={200}
            />
          </ConfigRow>
        </FeedConfigWrap>
        <UploadPhoto onPress={openPicker}>
          <UploadText>사진 첨부...</UploadText>
        </UploadPhoto>

        <SafeAreaView>
          <FlatList
            style={{
              paddingTop: 6,
            }}
            data={images}
            keyExtractor={(item: any, index: any) =>
              (item?.filename ?? item?.path) + index
            }
            renderItem={uploadPhotoItem}
            numColumns={3}
          />
        </SafeAreaView>

        <CaptionContainer>
          <Caption
            placeholder="내용"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text: string) => setValue("caption", text)}
            style={{ flex: 1, textAlignVertical: "top" }}
            numberOfLines={10}
            maxLength={1000}
            multiline={true}
          />
        </CaptionContainer>
      </Container>
    </DissmissKeyboard>
  );
}
