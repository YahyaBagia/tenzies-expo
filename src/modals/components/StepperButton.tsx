import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { Colors } from "@/src/common/Const";

interface IStepperButtonProps {
  icon: IconSource;
  onPress: () => void;
}

const StepperButton: React.FC<IStepperButtonProps> = ({ icon, onPress }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: Colors.ButtonBG,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  >
    <IconButton
      icon={icon}
      size={28}
      onPress={onPress}
      style={{ margin: 0 }}
      iconColor={Colors.Highlight}
    />
  </View>
);

export default StepperButton;
