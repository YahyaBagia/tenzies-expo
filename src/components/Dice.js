import { View } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";

const highlightColor = "#F29432";

const Dice = ({ title, isSelected, onPress }) => (
  // <View

  // >
  <TouchableRipple onPress={onPress} style={{
    borderRadius: 12,
    backgroundColor: isSelected ? highlightColor : "white",
    borderColor: highlightColor,
    borderWidth: 3,
    height: 75,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
  }}>
    <Text style={{ fontSize: 50, fontWeight: "bold" }}>
      {title}
    </Text>
  </TouchableRipple>
  // </View>
);

export default Dice;
