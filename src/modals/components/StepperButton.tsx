import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { Colors } from "@/src/common/Const";

interface IStepperButtonProps {
  icon: IconSource;
  onPress: () => void;
}

const StepperButton: React.FC<IStepperButtonProps> = ({ icon, onPress }) => (
  <View style={styles.container}>
    <IconButton
      icon={icon}
      size={28}
      onPress={onPress}
      style={styles.iconButton}
      iconColor={Colors.Highlight}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ButtonBG,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconButton: {
    margin: 0,
  },
});

export default StepperButton;
