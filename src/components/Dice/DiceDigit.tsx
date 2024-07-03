import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { FontNames } from "@/src/common/Const";

interface DiceDigitProps {
  title: string;
  isCompact: boolean;
}

const DiceDigit: React.FC<DiceDigitProps> = ({ title, isCompact }) => {
  const styleToUse = isCompact ? styles.compactText : styles.regularText;

  return (
    <Text style={[styles.baseText, styleToUse]} selectable={false}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontFamily: FontNames.MouldyCheese,
    marginTop: 10, // To center the text
  },
  regularText: {
    fontSize: 45,
  },
  compactText: {
    fontSize: 25,
  },
});

export default DiceDigit;
