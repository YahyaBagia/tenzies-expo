import { StyleSheet, ViewStyle } from "react-native";
import { IconButton, TouchableRipple } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { Colors } from "@/src/common/Const";

interface IStickyTopButtonProps {
  onPress: () => void;
  position: "left" | "right";
  icon: IconSource;
}

const StickyTopButton: React.FC<IStickyTopButtonProps> = (props) => {
  const { onPress, position, icon } = props;

  const containerStyles: ViewStyle = {
    right: position === "left" ? -3 : undefined,
    left: position === "right" ? -3 : undefined,
  };

  const borderRadiusStyles: ViewStyle = {
    borderTopLeftRadius: position === "left" ? 12 : undefined,
    borderBottomLeftRadius: position === "left" ? 12 : undefined,
    borderTopRightRadius: position === "right" ? 12 : undefined,
    borderBottomRightRadius: position === "right" ? 12 : undefined,
  };

  return (
    <TouchableRipple
      style={[styles.touchableRipple, containerStyles, borderRadiusStyles]}
      onPress={onPress}
    >
      <IconButton
        icon={icon}
        iconColor={Colors.ButtonBG}
        style={styles.iconButton}
        size={30}
      />
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  touchableRipple: {
    position: "absolute",
    top: 44,
    backgroundColor: Colors.Highlight,
    borderWidth: 3,
    borderColor: Colors.ButtonBG,
    overflow: "hidden",
  },
  iconButton: {
    margin: 0,
    marginHorizontal: 12,
  },
});

export default StickyTopButton;
