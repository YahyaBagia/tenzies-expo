import { View, Dimensions, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { isMobile as isRunningOnMobileDevice } from "react-device-detect";

import ScoresModal from "@/src/modals/ScoresModal";
import SettingsModal from "@/src/modals/SettingsModal";

import Utils from "@/src/common/Utils";
import { Colors, FontNames } from "@/src/common/Const";

import Dice from "@/src/components/Dice";
import GameHeader from "@/src/components/GameHeader";
import GameFooter from "@/src/components/GameFooter";
import GameButton from "@/src/components/GameButton";
import StickyTopButton from "@/src/components/StickyTopButton";

import useGameController from "@/src/controllers/GameController";
import ConfettiShower from "@/src/components/ConfettiShower";

const Main = () => {
  const {
    allDices,
    noOfRows,
    noOfRolls,
    missedDices,
    missedRolls,

    // events
    onPress_NewGame_or_Roll,
    onPressDie,
    onLayoutRootView,

    // methods
    CheckIfAllDicesAreTheSame,

    // visibility
    isScoresVisible,
    setIsScoresVisible,
    isSettingsVisible,
    setIsSettingsVisible,

    // timer
    tHours,
    tMinutes,
    tSeconds,
  } = useGameController();

  if (Utils.IsOnWeb()) {
    const { useHotkeys } = require("react-hotkeys-hook");
    useHotkeys("space", onPress_NewGame_or_Roll);
  }

  const GetDiceElements = () => {
    const diceElements = allDices.map(({ id, title, isSelected }, index) => (
      <Dice
        key={id}
        title={title}
        isSelected={isSelected}
        onPress={() => onPressDie(allDices[index])}
      />
    ));

    let splittedArrays = [];
    if (Utils.IsOnWeb()) {
      splittedArrays = Utils.SplitArray(diceElements, 2);
    } else {
      splittedArrays = Utils.SplitArray(diceElements, 4);
    }
    splittedArrays = Utils.SplitArray(diceElements, noOfRows);
    return splittedArrays;
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tenzies</Text>
          <Text style={styles.instructions}>
            Roll until all dice are the same.{"\n"}Click each die to freeze it
            at its current value between rolls.
            {isRunningOnMobileDevice === false &&
              "\nPress Space Bar (⎵) to roll the dices."}
          </Text>
          <GameHeader
            tHours={tHours}
            tMinutes={tMinutes}
            tSeconds={tSeconds}
            noOfRolls={noOfRolls}
          />
        </View>

        <View style={styles.diceContainer}>
          {GetDiceElements().map((dices, i) => (
            <View style={styles.diceRow} key={`${i}`}>
              {dices}
            </View>
          ))}
        </View>

        <GameButton
          title={CheckIfAllDicesAreTheSame() ? "New Game" : "ROLL"}
          onPress={onPress_NewGame_or_Roll}
          invertedColors={CheckIfAllDicesAreTheSame()}
        />

        <GameFooter missedDices={missedDices} missedRolls={missedRolls} />
      </View>
      <ConfettiShower visible={CheckIfAllDicesAreTheSame()} />
      <StickyTopButton
        icon={"cog"}
        onPress={() => setIsSettingsVisible(true)}
        position="left"
      />
      <StickyTopButton
        icon={"trophy"}
        onPress={() => setIsScoresVisible(true)}
        position="right"
      />
      <ScoresModal
        isVisible={isScoresVisible}
        onDismiss={() => setIsScoresVisible(false)}
      />
      <SettingsModal
        isVisible={isSettingsVisible}
        onDismiss={() => setIsSettingsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary,
    overflow: "hidden",
  },
  innerContainer: {
    justifyContent: "center",
    width: "90%",
  },
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
  diceContainer: {
    alignItems: "center",
  },
  diceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
    minWidth: Utils.IsOnWeb() ? 400 : "100%",
    maxWidth: 650,
    width: "100%",
  },
});

export default Main;
