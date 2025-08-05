import { StyleSheet, ViewStyle } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, FontNames } from "@/src/common/Const";

interface IStickyTopButtonProps {
  title?: string;
  icon: IconSource;
  onPress: () => void;
  position: "left" | "right";
  testID?: string;
}

const initialWidth = 75 as const;
const expandedWidth = 170 as const;

const AnimtedTouchableRipple =
  Animated.createAnimatedComponent(TouchableRipple);

const StickyTopButton: React.FC<IStickyTopButtonProps> = (props) => {
  const { title, icon, onPress, position, testID } = props;

  // const { top } = useSafeAreaInsets();

  const containerStyles: ViewStyle = {
    right: position === "left" ? -3 : undefined,
    left: position === "right" ? -3 : undefined,
    // top: top === 0 ? 50 : top,
    top: 50,
    flexDirection: position === "right" ? "row-reverse" : "row",
    alignItems: "center",
  };

  const borderRadiusStyles: ViewStyle = {
    borderTopLeftRadius: position === "left" ? 12 : undefined,
    borderBottomLeftRadius: position === "left" ? 12 : undefined,
    borderTopRightRadius: position === "right" ? 12 : undefined,
    borderBottomRightRadius: position === "right" ? 12 : undefined,
  };

  // Create an Animated.Value for the scale
  const width = useSharedValue<number>(initialWidth);

  const onHoverIn = () => (width.value = withSpring(expandedWidth));

  const onHoverOut = () => (width.value = withSpring(initialWidth));

  return (
    <AnimtedTouchableRipple
      style={[
        styles.touchableRipple,
        containerStyles,
        borderRadiusStyles,
        { width },
      ]}
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onPressIn={onHoverIn}
      onPressOut={onHoverOut}
      testID={testID}
    >
      <>
        <IconButton
          icon={icon}
          iconColor={Colors.ButtonBG}
          style={styles.iconButton}
          size={30}
        />
        <Text style={styles.labelButton}>{title}</Text>
      </>
    </AnimtedTouchableRipple>
  );
};

const styles = StyleSheet.create({
  touchableRipple: {
    position: "absolute",
    backgroundColor: Colors.Highlight,
    borderWidth: 3,
    borderColor: Colors.ButtonBG,
    overflow: "hidden",
  },
  iconButton: {
    margin: 0,
    marginHorizontal: 12,
  },
  labelButton: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    letterSpacing: 0.5,
  },
});

export default StickyTopButton;
