import { StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";

import DiceDigit from "./DiceDigit";
import DiceSymbol from "./DiceSymbol";

import { Colors } from "@/src/common/Const";

import { DiceNumber, DiceTypes } from "./types";

interface DiceProps {
  title: DiceNumber;
  isSelected?: boolean;
  onPress?: () => void;
  isCompact?: boolean;
  diceType: string;
}

const COMPACT_SIZE = 40;
const REGULAR_SIZE = 70;

const Dice: React.FC<DiceProps> = ({
  title,
  isSelected = false,
  onPress,
  isCompact = false,
  diceType,
}) => {
  const diceSize = isCompact ? COMPACT_SIZE : REGULAR_SIZE;
  const DiceContent = diceType === DiceTypes[0] ? DiceDigit : DiceSymbol;

  return (
    <TouchableRipple
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? Colors.Highlight : "white",
          borderColor: isSelected ? Colors.ButtonBG : Colors.Highlight,
          height: diceSize,
          width: diceSize,
        },
      ]}
    >
      <DiceContent title={title} isCompact={isCompact} />
    </TouchableRipple>
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
