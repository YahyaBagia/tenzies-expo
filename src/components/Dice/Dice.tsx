import { useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { TouchableRipple } from "react-native-paper";

import DiceDigit from "./DiceDigit";
import DiceSymbol from "./DiceSymbol";

import { Colors } from "@/src/common/Const";
import { useGlobalState } from "@/src/common/GlobalState";

import { DiceNumber, DiceType, DiceTypes } from "./types";

interface DiceProps {
  title: DiceNumber;
  isSelected?: boolean;
  onPress?: () => void;
  isCompact?: boolean;
  diceType?: DiceType;
}

const COMPACT_SIZE = 40;
const REGULAR_SIZE = 70;

const AnimtedTouchableRipple =
  Animated.createAnimatedComponent(TouchableRipple);

const Dice: React.FC<DiceProps> = ({
  title,
  isSelected = false,
  onPress,
  isCompact = false,
  diceType,
}) => {
  const [g_diceType] = useGlobalState("diceType");
  if (!diceType) diceType = g_diceType;

  const diceSize = isCompact ? COMPACT_SIZE : REGULAR_SIZE;
  const DiceContent = diceType === DiceTypes[0] ? DiceDigit : DiceSymbol;

  // Create an Animated.Value for the scale
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onHoverIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.12,
      useNativeDriver: true,
    }).start();
  };

  const onHoverOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimtedTouchableRipple
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? Colors.Highlight : "white",
          borderColor: isSelected ? Colors.ButtonBG : Colors.Highlight,
          height: diceSize,
          width: diceSize,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <DiceContent title={title} isCompact={isCompact} />
    </AnimtedTouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Dice;
