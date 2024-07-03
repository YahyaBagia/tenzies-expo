import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import { Colors, FontNames, Images } from "@/src/common/Const";
import Utils from "@/src/common/Utils";
import { LoadLocallyCachedState } from "@/src/common/GlobalState";
import { Image, View } from "react-native";

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

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    [FontNames.MouldyCheese]: require("@/assets/Fonts/MouldyCheeseRegular.ttf"),
  });
  const [isGlobalStateLoaded, setIsGlobalStateLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await LoadLocallyCachedState();
      await Utils.Sleep(1.5);
      setIsGlobalStateLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, isGlobalStateLoaded]);

  if (!fontLoaded || !isGlobalStateLoaded)
    return (
      <View style={{ flex: 1, backgroundColor: Colors.Primary }}>
        <Image
          source={Images.Splash}
          style={{ height: "100%", width: "100%" }}
          resizeMode={"contain"}
        />
      </View>
    );

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
