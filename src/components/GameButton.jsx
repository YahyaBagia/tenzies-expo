import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Colors, FontNames } from "@/src/common/Const";

const GameButton = ({ title, onPress, invertedColors = false }) => {
  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: 12,
        marginTop: 12,
        width: "100%",
        maxWidth: 615,
        alignSelf: "center",
      }}
    >
      <TouchableRipple
        style={{
          borderRadius: 12,
          backgroundColor: invertedColors ? Colors.Highlight : Colors.ButtonBG,
          borderWidth: 3,
          borderColor: invertedColors ? Colors.ButtonBG : "transparent",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: invertedColors ? Colors.ButtonBG : "white",
            fontSize: 30,
            fontFamily: FontNames.MouldyCheese,
            letterSpacing: 2,
          }}
          selectable={false}
        >
          {title}
        </Text>
      </TouchableRipple>
    </View>
  );
};

export default GameButton;
