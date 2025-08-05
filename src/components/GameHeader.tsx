import { View, Text, StyleSheet } from "react-native";
import { isMobile as isRunningOnMobileDevice } from "react-device-detect";

import Utils from "@/src/common/Utils";
import { FontNames } from "@/src/common/Const";

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
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Tenzies</Text>
      <Text style={styles.instructions}>
        Roll until all dice are the same.{"\n"}Click each die to freeze it at
        its current value between rolls.
        {isRunningOnMobileDevice === false &&
          "\nPress Space Bar (⎵) to roll the dices."}
      </Text>
      <View style={styles.container}>
        <Text style={styles.text}>
          {Utils.GetTimerText({ tHours, tMinutes, tSeconds })}
        </Text>
        <Text style={styles.text}>{noOfRolls} Rolls</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    margin: 12,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    fontSize: 44,
    letterSpacing: 5,
  },
  instructions: {
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    fontSize: 18,
    letterSpacing: 0.3,
  },
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
