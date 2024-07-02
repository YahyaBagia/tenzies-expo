import { View, StyleSheet } from "react-native";

import ScoreItemText from "./ScoreItemText";

import Dice from "@/src/components/Dice";

import Utils from "@/src/common/Utils";
import { Colors } from "@/src/common/Const";
import { ScoreObject } from "@/src/common/ScoreUtils";

interface IScoreItemProps {
  score: ScoreObject;
  index: number;
}

const ScoreItem: React.FC<IScoreItemProps> = ({ score, index }) => {
  const { time, noOfRolls, selectedDice, diceType } = score;
  const timeTaken = Utils.GetTimerText(time);

  return (
    <View style={styles.container}>
      <ScoreItemText value={`${index + 1}`} compact />
      <ScoreItemText value={timeTaken} />
      <ScoreItemText value={`${noOfRolls}`} />
      <View style={styles.diceContainer}>
        <Dice diceType={diceType} isCompact title={selectedDice} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.ButtonBG,
    padding: 2,
  },
  diceContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default ScoreItem;
