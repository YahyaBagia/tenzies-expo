import { View } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";

const highlightColor = "#F29432";

const Dice = ({ title, isSelected, onPress }) => (
  <TouchableRipple onPress={onPress} style={{
    borderRadius: 12,
    backgroundColor: isSelected ? highlightColor : "white",
    borderColor: highlightColor,
    borderWidth: 3,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  }}>
    <Text style={{ fontSize: 45, fontWeight: "bold" }}>
      {title}
    </Text>
  </TouchableRipple>
);

export default Dice;
