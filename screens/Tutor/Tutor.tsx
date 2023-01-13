import React, { useEffect } from "react";
import { View, Text } from "react-native";
import HeaderNav from "../../components/nav/HeaderNav";

export default function Tutor({ navigation }: any) {
  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: MessageButton,
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
      <Text style={{ color: "white" }}>Tutor</Text>
    </View>
  );
}
