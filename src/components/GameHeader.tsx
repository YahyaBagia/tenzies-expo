import { View, Text, StyleSheet } from "react-native";

import Utils from "../common/Utils";
import { FontNames } from "../common/Const";

interface IGameHeaderProps {
  tHours: number;
  tMinutes: number;
  tSeconds: number;
  noOfRolls: number;
}

const GameHeader: React.FC<IGameHeaderProps> = ({
  tHours,
  tMinutes,
  tSeconds,
  noOfRolls,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {Utils.GetTimerText({ tHours, tMinutes, tSeconds })}
      </Text>
      <Text style={styles.text}>{noOfRolls} Rolls</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 12,
    width: "100%",
    maxWidth: 480,
  },
  text: {
    flex: 1,
    fontSize: 24,
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    letterSpacing: 1,
  },
});

export default GameHeader;
