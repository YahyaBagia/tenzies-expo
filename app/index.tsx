import { useState, useRef, useEffect } from "react";
import { View, Dimensions, LayoutChangeEvent } from "react-native";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { useStopwatch } from "react-timer-hook";
import * as Crypto from "expo-crypto";
import { isMobile as isRunningOnMobileDevice } from "react-device-detect";

import Dice from "@/src/components/Dice";
import GameButton from "@/src/components/GameButton";

import ScoresModal from "@/src/modals/ScoresModal";
import SettingsModal from "@/src/modals/SettingsModal";

import Utils from "@/src/common/Utils";
import ScoreUtils from "@/src/common/ScoreUtils";
import useUpdateEffect from "@/src/common/CustomHooks";
import { useGlobalState } from "@/src/common/GlobalState";
import { Colors, FontNames, Sounds } from "@/src/common/Const";

type ConfettiCannonRef = React.ElementRef<typeof ConfettiCannon>;

interface IDice {
  title: string;
  isSelected: boolean;
  id: string;
}

const Main = () => {
  const [diceType] = useGlobalState("diceType");
  const [noOfDices] = useGlobalState("noOfDices");

  const CreateDice = (): IDice => ({
    title: `${Math.ceil(Math.random() * 6)}`,
    isSelected: false,
    id: Crypto.randomUUID(),
  });

  const GenerateNewDices = () => [...Array(noOfDices)].map(() => CreateDice());

  const {
    seconds: tSeconds,
    minutes: tMinutes,
    hours: tHours,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useStopwatch({});

  const [noOfRows, setNoOfRows] = useState(2);
  const [allDices, setAllDices] = useState(GenerateNewDices());
  const [noOfRolls, setNoOfRolls] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isScoresVisible, setIsScoresVisible] = useState(false);
  const [missedRolls, setMissedRolls] = useState(0);
  const [missedDices, setMissedDices] = useState(0);

  const leftConfettiRef = useRef<ConfettiCannonRef>(null);
  const rightConfettiRef = useRef<ConfettiCannonRef>(null);

  const getSelectedDices = () => allDices.filter((die) => die.isSelected);

  useEffect(() => {
    const selectedDices = getSelectedDices();
    if (selectedDices.length === 0) {
      resetNoOfRolls();
      resetTimer();
      pauseTimer();
    } else if (selectedDices.length === 1) {
      resetTimer();
      startTimer();
    } else if (CheckIfAllDicesAreTheSame()) {
      Utils.PlaySound(Sounds.Game_Finished);
      startConfettis();
      pauseTimer();
      ScoreUtils.AddNewScore(
        { tHours, tMinutes, tSeconds },
        noOfRolls,
        selectedDices[0].title,
        diceType,
        noOfDices
      );
    }
  }, [allDices]);

  useUpdateEffect(() => {
    setAllDices(GenerateNewDices());
    pauseTimer();
    resetTimer();
    calculateNoOfRows();
  }, [noOfDices]);

  const increaseNoOfRolls = () => {
    setNoOfRolls((oldNoOfRolls) => oldNoOfRolls + 1);
  };

  const resetNoOfRolls = () => setNoOfRolls(0);

  const startConfettis = () => {
    leftConfettiRef.current?.start();
    rightConfettiRef.current?.start();
  };

  const onPress_NewGame_or_Roll = () => {
    CheckIfAllDicesAreTheSame() ? onPressNewGame() : onPressRoll();
  };

  const onPressRoll = () => {
    Utils.PlaySound(Sounds.Roll_Dice);
    const selectedDices = getSelectedDices();
    if (selectedDices.length > 0) {
      increaseNoOfRolls();

      const { title } = selectedDices[0];
      const foundUnselected = allDices.filter(
        ({ title: t, isSelected }) => t === title && !isSelected
      );
      if (foundUnselected.length > 0) {
        setMissedRolls(missedRolls + 1);
        setMissedDices(missedDices + foundUnselected.length);
      }
    }
    setAllDices((oldDice) =>
      oldDice.map((die) => (die.isSelected ? die : CreateDice()))
    );
  };

  const onPressNewGame = () => {
    setMissedRolls(0);
    setMissedDices(0);
    setAllDices(GenerateNewDices());
    resetTimer();
  };

  const onPressDie = ({ id, title }: IDice) => {
    if (CheckIfAllDicesAreTheSame()) return;
    Utils.PlaySound(Sounds.Dice_Click);
    const [firstSelectedDice] = allDices.filter(({ isSelected }) => isSelected);
    if (firstSelectedDice) {
      if (title !== firstSelectedDice.title) return;
    }
    setAllDices((oldDices) =>
      oldDices.map((die) =>
        die.id === id ? { ...die, isSelected: !die.isSelected } : die
      )
    );
  };

  const CheckIfAllDicesAreTheSame = () => {
    const allSelected = allDices.every((die) => die.isSelected);
    const firstValue = allDices[0].title;
    const allSame = allDices.every((die) => die.title === firstValue);
    return allSelected && allSame;
  };

  const GetDiceElements = () => {
    const diceElements = allDices.map(({ id, title, isSelected }, index) => (
      <Dice
        key={id}
        title={title}
        isSelected={isSelected}
        onPress={() => onPressDie(allDices[index])}
        diceType={diceType}
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

  const onLayoutRootView = (layoutChangeEvent: LayoutChangeEvent) => {
    const { width } = layoutChangeEvent.nativeEvent.layout;
    calculateNoOfRows(width);
  };

  const calculateNoOfRows = (width = Dimensions.get("window").width) => {
    if (noOfDices === 10) {
      if (width <= 480) {
        setNoOfRows(5);
      } else {
        setNoOfRows(2);
      }
      return;
    }
    if (noOfDices === 4 || noOfDices === 6) {
      setNoOfRows(2);
    } else if (width <= 480) {
      setNoOfRows(4);
    } else if (width > 720) {
      setNoOfRows(2);
    }
  };

  if (Utils.IsOnWeb()) {
    const { useHotkeys } = require("react-hotkeys-hook");
    useHotkeys("space", onPress_NewGame_or_Roll);
  }

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

        <View style={{ alignItems: "center" }}>
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
                fontSize: 22,
                textAlign: "center",
                fontFamily: FontNames.MouldyCheese,
              }}
            >
              {missedDices}
              {"\n"}
              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  fontFamily: FontNames.MouldyCheese,
                }}
              >
                Missed Dices
              </Text>
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 22,
                textAlign: "center",
                fontFamily: FontNames.MouldyCheese,
              }}
            >
              {missedRolls}
              {"\n"}
              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  fontFamily: FontNames.MouldyCheese,
                }}
              >
                Missed Rolls
              </Text>
            </Text>
          </View>
        </View>
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
      <TouchableRipple
        style={{
          position: "absolute",
          top: 44,
          right: -3,
          backgroundColor: Colors.Highlight,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          borderWidth: 3,
          borderColor: Colors.ButtonBG,
          overflow: "hidden",
        }}
        onPress={() => setIsSettingsVisible(true)}
      >
        <IconButton
          icon={"cog"}
          iconColor={Colors.ButtonBG}
          style={{ margin: 0, marginHorizontal: 12 }}
          size={30}
        />
      </TouchableRipple>
      <TouchableRipple
        style={{
          position: "absolute",
          top: 44,
          left: -3,
          backgroundColor: Colors.Highlight,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          borderWidth: 3,
          borderColor: Colors.ButtonBG,
          overflow: "hidden",
        }}
        onPress={() => setIsScoresVisible(true)}
      >
        <IconButton
          icon={"trophy"}
          iconColor={Colors.ButtonBG}
          style={{ margin: 0, marginHorizontal: 12 }}
          size={30}
        />
      </TouchableRipple>
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
