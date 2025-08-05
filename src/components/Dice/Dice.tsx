import { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import DiceDigit from "./DiceDigit";
import DiceSymbol from "./DiceSymbol";

import { Colors } from "@/src/common/Const";
import { useGlobalStore, useShallow } from "@/src/common/GlobalStore";

import { DiceType, IDiceData } from "./types";

interface DiceProps {
  diceData: IDiceData;
  onPress?: () => void;
  isCompact?: boolean;
  diceType?: DiceType;

  // TO TRIGGER RERENDER OF UNSELECTED DICE WITH ANIMATION
  // WILL WORK ONLY WHEN AT LEAST ONE DICE IS SELECTED
  // BECAUSE UNTIL THEN, `noOfRolls` STAYS 0 EVEN IF USER HAS ROLLED THE DICE NUMEROUS TIMES
  noOfRolls?: number;
}

const COMPACT_SIZE = 40;
const REGULAR_SIZE = 70;

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 120,
} as const;

const Dice: React.FC<DiceProps> = ({
  diceData: { id, number, isSelected },
  onPress,
  isCompact = false,
  diceType,
  noOfRolls,
}) => {
  const [displayNumber, setDisplayNumber] = useState(number);
  const [g_diceType, animateDices] = useGlobalStore(
    useShallow((s) => [s.diceType, s.animateDices])
  );
  if (!diceType) diceType = g_diceType;

  const diceSize = isCompact ? COMPACT_SIZE : REGULAR_SIZE;

  // Reanimated shared value for scale
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const contentOpacity = useSharedValue(1);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  // Watch for dice number change
  useEffect(() => {
    if (!animateDices) {
      rotate.value = withTiming(0, { duration: 300 });
      setDisplayNumber(number);
    } else if (!isSelected && !isCompact) {
      const randomAngle1 = Math.floor(Math.random() * 360);
      hideDiceContent();
      rotate.value = withTiming(randomAngle1, { duration: 300 }, async () => {
        runOnJS(setDisplayNumber)(number);
        runOnJS(showDiceContent)();
      });
    }
  }, [number, noOfRolls, isSelected, isCompact, animateDices]);

  const hideDiceContent = () =>
    (contentOpacity.value = withTiming(0, { duration: 100 }));

  const showDiceContent = () =>
    (contentOpacity.value = withTiming(1, { duration: 100 }));

  const onHoverIn = () => (scale.value = withSpring(1.12, SPRING_CONFIG));

  const onHoverOut = () => (scale.value = withSpring(1, SPRING_CONFIG));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableRipple
        testID={`dice-${id}`}
        onPress={onPress}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        onPressIn={Platform.OS === "web" ? undefined : onHoverIn}
        onPressOut={Platform.OS === "web" ? undefined : onHoverOut}
        style={[
          styles.touchable,
          {
            backgroundColor: isSelected ? Colors.Highlight : "white",
            borderColor: isSelected ? Colors.ButtonBG : Colors.Highlight,
            height: diceSize,
            width: diceSize,
          },
        ]}
        borderless
      >
        <Animated.View style={[contentAnimatedStyle, styles.content]}>
          {diceType === "Digit" ? (
            <DiceDigit number={displayNumber} isCompact={isCompact} />
          ) : (
            <DiceSymbol number={displayNumber} isCompact={isCompact} />
          )}
        </Animated.View>
      </TouchableRipple>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    borderRadius: 12,
    borderWidth: 3,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default Dice;
