import { View, Text, StyleSheet } from "react-native";

import { FontNames } from "@/src/common/Const";

interface IGameFooterProps {
  missedDices: number;
  missedRolls: number;
}

const GameFooter: React.FC<IGameFooterProps> = ({
  missedDices,
  missedRolls,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.mainText}>
          {missedDices}
          {"\n"}
          <Text style={styles.subText}>Missed Dices</Text>
        </Text>
        <Text style={styles.mainText}>
          {missedRolls}
          {"\n"}
          <Text style={styles.subText}>Missed Rolls</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
    width: "100%",
    maxWidth: 480,
  },
  mainText: {
    flex: 1,
    fontSize: 25,
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    letterSpacing: 1.5,
  },
  subText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    letterSpacing: 0.5,
  },
});

export default GameFooter;
