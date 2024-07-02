import { Text, StyleSheet } from "react-native";

import { FontNames } from "@/src/common/Const";

interface ScoreItemTextProps {
  value: string;
  compact?: boolean;
}

const ScoreItemText: React.FC<ScoreItemTextProps> = ({
  value,
  compact = false,
}) => <Text style={[styles.text, compact && styles.compact]}>{value}</Text>;

const styles = StyleSheet.create({
  text: {
    flex: 1,
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    fontSize: 22,
    marginHorizontal: 1,
  },
  compact: {
    flex: 0.5,
  },
});

export default ScoreItemText;
