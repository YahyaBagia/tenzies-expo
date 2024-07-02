import { View, ViewStyle, StyleSheet } from "react-native";

import { Colors } from "@/src/common/Const";

interface DiceDotProps {
  size: number;
  style?: ViewStyle;
}

const DiceDot: React.FC<DiceDotProps> = ({ size, style }) => (
  <View
    style={[
      styles.dot,
      {
        borderRadius: size / 2,
        height: size,
        width: size,
      },
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  dot: {
    backgroundColor: Colors.ButtonBG,
    position: "absolute",
  },
});

export default DiceDot;
