import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";

type GroupCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "GroupDetail"
>;

const GroupListContainer = styled.View`
  width: 33.33%;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
`;

const GroupListImage = styled.Image`
  padding: 16px;
  width: 108px;
  height: 104px;
  border-radius: 16px;
  border: 1px solid black;
`;

const GroupListTitleWrap = styled.View`
  padding: 16px 0;
  flex-direction: row;
`;

const GroupListTitle = styled.Text`
  color: ${(props) => props.theme.blackColor};
  font-size: 16px;
  font-weight: 600;
`;

const GroupDetailBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export default function Slide({ id, groupname, photoUrl }: any) {
  const navigation = useNavigation<GroupCompNavigationProps>();
  return (
    <GroupListContainer>
      <GroupDetailBtn
        onPress={() => navigation.navigate("GroupDetail", { id })}
      >
        <GroupListImage source={{ uri: photoUrl }} />
        <GroupListTitleWrap>
          <GroupListTitle>{groupname}</GroupListTitle>
        </GroupListTitleWrap>
      </GroupDetailBtn>
    </GroupListContainer>
  );
}
