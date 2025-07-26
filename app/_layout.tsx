import "react-native-reanimated";
import { useEffect, useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { setAudioModeAsync } from "expo-audio";

import { Colors, FontNames, Images } from "@/src/common/Const";
import { useIsGlobalStoreReady } from "@/src/hooks/useIsGlobalStoreReady";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.Primary,
    accent: Colors.Accent,
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

setAudioModeAsync({
  playsInSilentMode: true,
  allowsRecording: false,
});

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    [FontNames.MouldyCheese]: require("@/assets/Fonts/MouldyCheeseRegular.ttf"),
  });

  const isGlobalStateReady = useIsGlobalStoreReady();

  useEffect(() => {
    if (fontLoaded && isGlobalStateReady) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, isGlobalStateReady]);

  if (!fontLoaded || !isGlobalStateReady)
    return (
      <View style={styles.splashContainer}>
        <Image
          source={Images.Splash}
          style={styles.splashImage}
          resizeMode={"contain"}
        />
      </View>
    );

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Tenzies" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  splashImage: {
    height: "100%",
    width: "100%",
  },
});
