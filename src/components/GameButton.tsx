import { StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Colors, FontNames } from "@/src/common/Const";

interface GameButtonProps {
  title: string;
  onPress: () => void;
  invertedColors?: boolean;
  testID?: string;
}

const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  invertedColors = false,
  testID,
}) => {
  return (
    <TouchableRipple
      testID={testID}
      style={[
        styles.button,
        {
          backgroundColor: invertedColors ? Colors.Highlight : Colors.ButtonBG,
          borderColor: invertedColors ? Colors.ButtonBG : "transparent",
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          { color: invertedColors ? Colors.ButtonBG : "white" },
        ]}
        selectable={false}
      >
        {title}
      </Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    marginTop: 12,
    width: "100%",
    maxWidth: 615,
    borderRadius: 12,
    borderWidth: 3,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
    fontFamily: FontNames.MouldyCheese,
    letterSpacing: 2,
    marginTop: 8, // To center the text
  },
});

export default GameButton;
