import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import Main from "./src/Main";
import { Colors } from "./src/common/Const";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.Primary,
    accent: Colors.Accent,
  },
};

const App = () => (
  <PaperProvider theme={theme}>
    <Main />
    <StatusBar style="auto" />
  </PaperProvider>
);

export default App;
