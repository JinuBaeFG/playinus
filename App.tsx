import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { cache, isLoggedInVar, logUserOut, tokenVar } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { AsyncStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./styles";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const preloadAssets = async () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font: any) => Font.loadAsync(font));
    const imagesToLoad = [
      require("./assets/logo.png"),
      require("./assets/emptyAvatar.png"),
      "https://raw.githubusercontent.com/nomadcoders/instaclone-native/93a5b77e98eefdf5084bfae44653ba67e4ca312c/assets/logo.png",
    ];
    const imagePromises = imagesToLoad.map((image: any) =>
      Asset.loadAsync(image)
    );
    await Promise.all([...fontPromises, ...imagePromises]);
  };
  const preload = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    const persistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    await persistor.restore();
    preloadAssets();
  };

  const isDark = useColorScheme() === "dark";

  if (loading) {
    return (
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <AppLoading
          startAsync={preload}
          onError={console.warn}
          onFinish={onFinish}
        />
      </ThemeProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <NavigationContainer>
          <SafeAreaView />
          <StatusBar />
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  );
}
