import { StyleSheet, View, ViewStyle } from "react-native";

import DiceDot from "./DiceDot";
import { DiceFaceConfig, DiceNumber } from "./types";

interface DiceSymbolProps {
  title: DiceNumber;
  isCompact: boolean;
}

const COMPACT_SIZE = 8;
const REGULAR_SIZE = 15;

const diceFaceConfigs: Record<DiceNumber, DiceFaceConfig> = {
  "1": [{}],
  "2": [
    { top: 0, left: 0 },
    { bottom: 0, right: 0 },
  ],
  "3": [{}, { top: 0, left: 0 }, { bottom: 0, right: 0 }],
  "4": [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ],
  "5": [
    {},
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ],
  "6": [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { left: 0 },
    { right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ],
};

const DiceFace: React.FC<{ config: DiceFaceConfig; size: number }> = ({
  config,
  size,
}) => (
  <>
    {config.map((position, index) => (
      <DiceDot key={index} size={size} style={position as ViewStyle} />
    ))}
  </>
);

const DiceSymbol: React.FC<DiceSymbolProps> = ({ title, isCompact }) => {
  const size = isCompact ? COMPACT_SIZE : REGULAR_SIZE;

  return (
    <View style={styles.container}>
      <DiceFace config={diceFaceConfigs[title]} size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "90%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DiceSymbol;
