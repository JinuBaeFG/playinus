import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { colors } from "../../color";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import TagBottomSheet, { RBSheetProps } from "react-native-raw-bottom-sheet";
import SportsBottomSheet from "react-native-raw-bottom-sheet";
import ActiveInfoSheet from "react-native-raw-bottom-sheet";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
  useWindowDimensions,
  SafeAreaView,
  FlatList,
} from "react-native";
import useTag from "../../hooks/useTag";
import useSportsEvent from "../../hooks/useSportsEvent";
import useGroupInfo from "../../hooks/useGroupInfo";
import FacilityList from "../../components/facility/FacilityList";
import { useNavigation } from "@react-navigation/native";

const GROUP_QUERY = gql`
  query seeGroup($id: Int!) {
    seeGroup(id: $id) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const EDIT_GROUP_MUTATION = gql`
  mutation editGroup(
    $id: Int!
    $groupname: String
    $activeArea: String
    $areaLatitude: String
    $areaLongitude: String
    $sportsEvent: String
    $photoUrl: Upload
    $maxMember: Int
    $groupInfo: [String]
    $groupTag: [String]
  ) {
    editGroup(
      id: $id
      groupname: $groupname
      activeArea: $activeArea
      areaLatitude: $areaLatitude
      areaLongitude: $areaLongitude
      sportsEvent: $sportsEvent
      photoUrl: $photoUrl
      maxMember: $maxMember
      groupInfo: $groupInfo
      groupTag: $groupTag
    ) {
      ok
      error
    }
  }
`;

const Container = styled.ScrollView`
  flex: 1;
  width: 100%;
  padding: 16px;
`;

const TextWrap = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

const ListLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
  margin-left: 8px;
`;

const ListButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const GroupActiveWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const GroupActiveInfoWrap = styled.View`
  flex-direction: row;
`;

const ActiveDateButton = styled.TouchableOpacity`
  width: 84px;
`;

const ActiveHistList = styled.View``;

const ActiveHistWrap = styled.View`
  flex-direction: row;
  width: 100%;
  margin: 8px 0;
`;

const ActiveHistDate = styled.Text`
  width: 84px;
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const ActiveHistDisc = styled.Text`
  margin-right: 8px;
  font-size: 12px;
  color: ${(props) => props.theme.blackColor};
`;

const TextInnerWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MarginBottom = styled.View`
  margin-bottom: 100px;
`;

export default function EditGroup({ navigation, route }: any) {
  const id = route.params.id;
  const { data: groupData, loading } = useQuery(GROUP_QUERY, {
    variables: {
      id,
    },
  });

  // ?????? ?????? - ??????
  const [images, setImages] = useState([]);
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
    setValue("photoUrl", files);
    files = [];
  };

  const openPicker = async () => {
    try {
      const response: any = await MultipleImagePicker.openPicker<any>({
        selectedAssets: images,
        mediaType: "image",
        usedCameraButton: false,
        isCrop: true,
        isCropCircle: true,
        maxSelectedAssets: 1,
        maximumMessageTitle: "????????? ??? ??????",
        maximumMessage: "?????? ????????? ????????? 1?????? ????????? ???????????????.",
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

  const dimensions = useWindowDimensions();
  const winWidth = dimensions.width;
  const mediaWidth = winWidth - 72;

  // ?????? ?????? - ???
  const [editGroupMutation, { loading: editLoading }] =
    useMutation(EDIT_GROUP_MUTATION);
  const { register, handleSubmit, setValue } = useForm();
  const onValid = () => {};
  const HeaderRight = () => {
    return (
      <TouchableOpacity onPress={handleSubmit(onValid)}>
        <HeaderRightText>??????</HeaderRightText>
      </TouchableOpacity>
    );
  };

  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );

  useEffect(() => {
    navigation.setOptions({
      title: "?????? ?????? ??????",
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, []);

  useEffect(() => {
    register("id");
    register("groupname");
    register("activeArea");
    register("areaLatitude");
    register("areaLongitude");
    register("sportsEvent");
    register("photoUrl");
    register("maxMember");
    register("groupInfo");
    register("groupTag");
  }, [register]);

  // ?????? ?????? ?????? - ??????
  const refTagSheet = useRef<RBSheetProps | undefined>();
  const tagList = useTag();
  const [tagData, setTagData] = useState(tagList);
  const setTag = () => {
    let temp = tagData.map((item: any) => {
      if (groupData?.seeGroup?.groupTag?.isUse === true) {
        return { ...item, isUse: !item.isUse };
        if (groupData?.seeGroup?.groupTag?.isCustom === true) {
          return { ...item, isCustom: !item.isCustom };
        }
      } else {
        return { ...item, isUse: false, isCustom: false };
      }

      return item;
    });
    setTagData(temp);
  };
  const onTagPress = (id: any) => {
    let temp = tagData.map((item: any) => {
      if (id === item.id) {
        return { ...item, isUse: !item.isUse };
      }
      return item;
    });
    setTagData(temp);
  };
  const onTagClose = () => {
    let temp = tagData.map((tag: any) => {
      if (tag.isUse) {
        return tag.tagname + ", ";
      }
    });
    return temp;
  };
  const renderTagItem = ({ item }: any) => {
    return (
      <ListButton onPress={() => onTagPress(item.id)}>
        <MaterialCommunityIcons
          size={24}
          name={item.isUse ? "checkbox-marked" : "checkbox-blank-outline"}
        />
        <ListLabel>{item.tagname}</ListLabel>
      </ListButton>
    );
  };
  // ?????? ?????? ?????? - ???
  // ?????? ?????? ?????? - ??????
  const refSportsEventSheet = useRef<RBSheetProps | undefined>();
  const eventList = useSportsEvent();
  const [eventData, setEventData] = useState(eventList);
  // ?????????(?????????) ?????? ????????????
  const setSportsEvent = () => {
    let temp = eventData.map((item: any) => {
      if (groupData?.seeGroup?.sportsEvent === item.eventname) {
        return { ...item, isChecked: !item.isChecked };
      } else {
        return { ...item, isChecked: false };
      }
      return item;
    });
    setEventData(temp);
  };
  useEffect(() => {
    setSportsEvent();
  }, []);

  const onSportsEventPress = (id: any) => {
    let temp = eventData.map((item: any) => {
      if (id === item.id) {
        return { ...item, isChecked: !item.isChecked };
      } else {
        return { ...item, isChecked: false };
      }
      return item;
    });
    setEventData(temp);
  };
  const onSportsEventClose = () => {
    let temp = eventData.map((tag: any) => {
      if (tag.isChecked) {
        return tag.eventname + ", ";
      }
    });
    setValue("sportsEvent", temp);
    return temp;
  };
  const renderSportsEventItem = ({ item }: any) => {
    return (
      <ListButton
        onPress={() => {
          onSportsEventPress(item.id);
          refSportsEventSheet.current?.close();
        }}
      >
        <MaterialCommunityIcons
          size={24}
          name={item.isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
        />
        <ListLabel>{item.eventname}</ListLabel>
      </ListButton>
    );
  };
  // ?????? ?????? ?????? - ???
  // ?????? ?????? ?????? - ??????
  LocaleConfig.locales["kr"] = {
    monthNames: [
      "1???",
      "2???",
      "3???",
      "4???",
      "5???",
      "6???",
      "7???",
      "8???",
      "9???",
      "10???",
      "11???",
      "12???",
    ],
    monthNamesShort: [
      "1???",
      "2???",
      "3???",
      "4???",
      "5???",
      "6???",
      "7???",
      "8???",
      "9???",
      "10???",
      "11???",
      "12???",
    ],
    dayNames: [
      "?????????",
      "?????????",
      "?????????",
      "?????????",
      "?????????",
      "?????????",
      "?????????",
    ],
    dayNamesShort: ["???", "???", "???", "???", "???", "???", "???"],
  };
  LocaleConfig.defaultLocale = "kr";
  const refAcitveSheet = useRef<RBSheetProps | undefined>();
  const groupInfoList = useGroupInfo(id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDate, setActiveDate] = useState("?????? ??????");
  const [activeDisc, setActiveDisc] = useState("");
  const [activeHist, setActiveHist] = useState(groupInfoList);

  const onSetActiveInfo = ({ activeIndex, activeDisc, activeDate }: any) => {
    groupInfoList.push({
      index: activeIndex,
      discription: activeDisc,
      awardDate: activeDate,
    });
    setActiveHist(groupInfoList);
    setActiveDate("?????? ??????");
    setActiveDisc("");
  };
  // ?????? ?????? ?????? - ???
  // ?????? ?????? - ??????
  // ?????? ?????? - ???
  // ?????? ?????? ?????? - ??????
  // ?????? ?????? ?????? - ???
  return (
    <Container>
      <TextWrap>
        <TextLabel>?????????</TextLabel>
        <TextInput
          placeholder="?????????"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("groupname", text)}
          maxLength={20}
        >
          {groupData?.seeGroup?.groupname}
        </TextInput>
      </TextWrap>
      <Upload onPress={() => refSportsEventSheet.current?.open()}>
        <TextLabel>??????</TextLabel>
        <UploadText>{onSportsEventClose()}</UploadText>
        <SportsBottomSheet
          ref={refSportsEventSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            draggableIcon: {
              backgroundColor: "#000",
            },
          }}
        >
          <SafeAreaView>
            <FlatList
              keyExtractor={(item: any) => item.id}
              data={eventData}
              renderItem={renderSportsEventItem}
            />
          </SafeAreaView>
        </SportsBottomSheet>
      </Upload>
      <Upload onPress={openPicker}>
        <TextLabel>?????? ?????????</TextLabel>
        <UploadText>?????? ??????...</UploadText>
        {images.map((item: any) => (
          <SafeAreaView key={item}>
            <Image
              style={{
                width: mediaWidth,
                height: mediaWidth,
                margin: 4,
              }}
              source={{
                uri: item.path,
              }}
            />
            <TouchableOpacity
              onPress={() => onDelete(item)}
              activeOpacity={0.9}
            >
              <Text>??????</Text>
            </TouchableOpacity>
          </SafeAreaView>
        ))}
      </Upload>
      <TextWrap>
        <TextLabel>?????? ?????? ???</TextLabel>
        <TextInput
          placeholder="?????? ?????? ???"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("groupname", text)}
          maxLength={3}
        >
          {groupData?.seeGroup?.maxMember}
        </TextInput>
      </TextWrap>
      <Upload onPress={() => refTagSheet.current?.open()}>
        <TextLabel>?????? ??????</TextLabel>
        <UploadText>{onTagClose()}</UploadText>
        <TagBottomSheet
          ref={refTagSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            draggableIcon: {
              backgroundColor: "#000",
            },
          }}
        >
          <SafeAreaView>
            <FlatList
              keyExtractor={(item: any) => item.id}
              data={tagData}
              renderItem={renderTagItem}
            />
          </SafeAreaView>
        </TagBottomSheet>
      </Upload>
      <TextWrap>
        <TextLabel>?????? ?????? ??????</TextLabel>
        <GroupActiveWrap>
          <GroupActiveInfoWrap>
            <ActiveDateButton onPress={() => refAcitveSheet.current?.open()}>
              <UploadText>{activeDate}</UploadText>
            </ActiveDateButton>
            <TextInput
              placeholder="?????? ????????? ???????????????"
              placeholderTextColor="rgba(0,0,0,0.2)"
              onChangeText={(text) => {
                setValue("groupname", text);
                setActiveDisc(text);
              }}
              maxLength={20}
              style={{ marginBottom: 8 }}
            >
              {activeDisc}
            </TextInput>
          </GroupActiveInfoWrap>
          <AddButton
            onPress={() => {
              setActiveIndex(activeIndex + 1);
              onSetActiveInfo({ activeIndex, activeDisc, activeDate });
            }}
          >
            <UploadText>?????? </UploadText>
            <Ionicons name="add-circle" size={12} />
          </AddButton>
          <ActiveInfoSheet
            ref={refAcitveSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              draggableIcon: {
                backgroundColor: "#000",
              },
            }}
            height={400}
          >
            <Calendar
              onDayPress={(day: any) => {
                setActiveDate(day.dateString);
                refAcitveSheet.current?.close();
              }}
              markedDates={{ activeDate: { selected: true } }}
            />
          </ActiveInfoSheet>
        </GroupActiveWrap>
        <ActiveHistList>
          {activeHist.map((item: any) => (
            <ActiveHistWrap key={item.index}>
              <ActiveHistDate>{item.awardDate}</ActiveHistDate>
              <ActiveHistDisc>{item.discription}</ActiveHistDisc>
            </ActiveHistWrap>
          ))}
        </ActiveHistList>
      </TextWrap>
      <Upload onPress={() => navigation.navigate("ActiveArea")}>
        <TextLabel>????????????</TextLabel>
        <UploadText></UploadText>
      </Upload>
      <TextWrap>
        <TextInnerWrap>
          <TextLabel>?????? ?????? ??????</TextLabel>
          <Upload onPress={() => {}}>
            <UploadText>
              ?????? ?????? <Ionicons name="add-circle" size={12} />
            </UploadText>
          </Upload>
        </TextInnerWrap>
        {groupData?.seeGroup?.facility.map((facility: any) => (
          <FacilityList {...facility} key={facility.id} />
        ))}
      </TextWrap>
      <MarginBottom />
    </Container>
  );
}
