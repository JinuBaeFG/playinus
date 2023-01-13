import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ROOM_FRAGMENT_NATIVE } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import { FlatList, View } from "react-native";
import RoomListComp from "../components/rooms/RoomListComp";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT_NATIVE}
`;

export default function RoomList() {
  const { data, loading } = useQuery(SEE_ROOMS_QUERY);
  const renderItem = ({ item: room }: any) => {
    return <RoomListComp {...room} />;
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          ></View>
        )}
        style={{ width: "100%" }}
        data={data?.seeRooms}
        keyExtractor={(room) => "" + room.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
