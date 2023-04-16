import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';

import Main from "./src/Main";
import Utils from "./src/common/Utils";
import { Colors, FontNames, Images } from "./src/common/Const";
import { LoadLocallyCachedState } from "./src/common/GlobalState";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.Primary,
    accent: Colors.Accent,
  },
};

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [isGlobalStateLoaded, setIsGlobalStateLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    [FontNames.MouldyCheese]: require('./assets/Fonts/MouldyCheeseRegular.ttf'),
  });

  useEffect(() => {
    (async () => {
      await LoadLocallyCachedState();
      await Utils.Sleep(2);
      setIsGlobalStateLoaded(true)
      await SplashScreen.hideAsync();
    })()
  }, [])

  if (!isGlobalStateLoaded || !fontsLoaded)
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
      <Main />
      <StatusBar style="auto" />
    </PaperProvider>
  )
};

export default App;
