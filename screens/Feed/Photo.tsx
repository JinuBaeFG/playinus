import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PhotoComp from "../../components/PhotoComp";
import ScreenLayout from "../../components/ScreenLayout";
import {
  COMMENT_FRAGMENT_NATIVE,
  PHOTO_FRAGMENT_NATIVE,
} from "../../fragments";

const SEE_PHOTO = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
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

export default function Photo({ navigation, route }: any) {
  const { data, loading, refetch } = useQuery(SEE_PHOTO, {
    variables: {
      id: route?.params?.photoId,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={{ backgroundColor: "black", paddingTop: 10, paddingBottom: 10 }}
        contentContainerStyle={{
          backgroundColor: "black",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PhotoComp {...data?.seePhoto} navigation={navigation} />
      </ScrollView>
    </ScreenLayout>
  );
}
