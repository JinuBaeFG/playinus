import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { cache, logUserOut } from "../../apollo";
import useMe from "../../hooks/useMe";

export default function MyProfile({ navigation }: any) {
  const { data } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, []);
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>My Profile</Text>
      <TouchableOpacity
        onPress={() => {
          cache.gc();
          logUserOut();
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
