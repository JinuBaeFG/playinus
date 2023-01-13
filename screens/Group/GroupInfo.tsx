import React from "react";
import styled from "styled-components/native";
import FacilityList from "../../components/facility/FacilityList";

const MainContainer = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => props.theme.grayInactColor};
`;

const InfoContainer = styled.View`
  padding: 8px 16px 16px;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
`;
const InfoTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  padding: 8px 0;
`;

const InfoWrap = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 4px 0;
  align-items: center;
`;

const InfoLabel = styled.Text`
  width: 100px;
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const UserWrap = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 4px 0;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid black;
  margin-right: 16px;
`;

const Username = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.blackColor};
  font-weight: 600;
`;

export default function GroupInfo({ navigation, route }: any) {
  const data = route.params.data;

  const goToProfile = ({ username, id }: any) => {
    navigation.navigate("Profile", {
      username: username,
      id: id,
    });
  };

  return (
    <MainContainer>
      <InfoContainer>
        <InfoTitle>기본 정보</InfoTitle>
        <InfoWrap>
          <InfoLabel>종목</InfoLabel>
          <InfoText>{data.sportsEvent}</InfoText>
        </InfoWrap>
        <InfoWrap>
          <InfoLabel>활동 지역</InfoLabel>
          <InfoText>{data.activeArea}</InfoText>
        </InfoWrap>
        <InfoWrap>
          <InfoLabel>인원</InfoLabel>
          <InfoText>
            {data.userCount} / {data.maxMember}
          </InfoText>
        </InfoWrap>
        <InfoWrap>
          <InfoLabel>태그</InfoLabel>
          <InfoText>없음</InfoText>
        </InfoWrap>
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>활동 정보</InfoTitle>
        {data.groupInfo.map((info: any) => (
          <InfoWrap key={info.id}>
            <InfoLabel>{info.awardDate}</InfoLabel>
            <InfoText>{info.discription}</InfoText>
          </InfoWrap>
        ))}
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>자주 찾는 시설</InfoTitle>
        {data.facility.map((facility: any) => (
          <FacilityList {...facility} key={facility.id} />
        ))}
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>회원</InfoTitle>
        {data.users.map((user: any) => {
          return (
            <UserWrap
              key={user.id}
              onPress={() =>
                goToProfile({ username: user.username, id: user.id })
              }
            >
              <Avatar source={{ uri: user.avatar }} />
              <Username>{user.username}</Username>
            </UserWrap>
          );
        })}
      </InfoContainer>
    </MainContainer>
  );
}
