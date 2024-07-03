import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { isMobile as isRunningOnMobileDevice } from "react-device-detect";

import GameButton from "@/src/components/GameButton";

import ScoresModal from "@/src/modals/ScoresModal";
import SettingsModal from "@/src/modals/SettingsModal";

import Utils from "@/src/common/Utils";
import { Colors, FontNames } from "@/src/common/Const";

import Dice from "@/src/components/Dice";
import StickyTopButton from "@/src/components/StickyTopButton";
import MissedCounters from "@/src/components/MissedCounters";

import useGameController from "@/src/controllers/GameController";

const Main = () => {
  const {
    allDices,
    // diceType,
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

    // confettis
    leftConfettiRef,
    rightConfettiRef,
    startConfettis,
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
        // diceType={diceType}
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.Primary,
        overflow: "hidden",
      }}
      onLayout={onLayoutRootView}
    >
      <View
        style={{
          justifyContent: "center",
          width: "90%",
        }}
      >
        <View style={{ margin: 12, alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: FontNames.MouldyCheese,
              fontSize: 44,
            }}
          >
            Tenzies
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: FontNames.MouldyCheese,
              fontSize: 18,
            }}
          >
            Roll until all dice are the same.{"\n"}Click each die to freeze it
            at its current value between rolls.
            {isRunningOnMobileDevice === false &&
              "\nPress Space Bar (⎵) to roll the dices."}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              width: "100%",
              maxWidth: 480,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 24,
                textAlign: "center",
                fontFamily: FontNames.MouldyCheese,
              }}
            >
              {Utils.GetTimerText({ tHours, tMinutes, tSeconds })}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 24,
                textAlign: "center",
                fontFamily: FontNames.MouldyCheese,
              }}
            >
              {noOfRolls} Rolls
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          {GetDiceElements().map((dices, i) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 8,
                minWidth: Utils.IsOnWeb() ? 400 : "100%",
                maxWidth: 650,
                width: "100%",
              }}
              key={`${i}`}
            >
              {dices}
            </View>
          ))}
        </View>

        <GameButton
          title={CheckIfAllDicesAreTheSame() ? "New Game" : "ROLL"}
          onPress={onPress_NewGame_or_Roll}
          invertedColors={CheckIfAllDicesAreTheSame()}
        />

        <MissedCounters missedDices={missedDices} missedRolls={missedRolls} />
      </View>
      {CheckIfAllDicesAreTheSame() && (
        <>
          <ConfettiCannon
            count={50}
            origin={{ x: 100, y: 100 }}
            autoStart={true}
            ref={leftConfettiRef}
            onAnimationEnd={startConfettis}
            fadeOut={true}
          />
          <ConfettiCannon
            count={50}
            origin={{ x: Dimensions.get("window").width - 100, y: 100 }}
            autoStart={true}
            ref={rightConfettiRef}
            onAnimationEnd={startConfettis}
            fadeOut={true}
          />
        </>
      )}
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

export default Main;
