import { Text } from "react-native-paper";

import { FontNames } from "@/src/common/Const";

interface DiceDigitProps {
  title: string;
  isCompact: boolean;
}

const DiceDigit: React.FC<DiceDigitProps> = ({ title, isCompact }) => {
  const diceFontSize = isCompact ? 25 : 45;
  return (
    <Text
      style={{
        fontSize: diceFontSize,
        fontFamily: FontNames.MouldyCheese,
        marginTop: 10, // To center the text
      }}
      selectable={false}
    >
      {title}
    </Text>
  );
};

export default DiceDigit;
