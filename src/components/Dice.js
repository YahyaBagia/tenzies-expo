import { TouchableRipple, Text } from "react-native-paper";

import { Colors } from "../common/Const";

const Dice = ({ title, isSelected, onPress }) => (
  <TouchableRipple
    onPress={onPress}
    style={{
      borderRadius: 12,
      backgroundColor: isSelected ? Colors.HighlightDice : "white",
      borderColor: Colors.HighlightDice,
      borderWidth: 3,
      height: 70,
      width: 70,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 45, fontWeight: "bold" }}>{title}</Text>
  </TouchableRipple>
);

export default Dice;
