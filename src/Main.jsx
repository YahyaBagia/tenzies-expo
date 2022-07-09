import { useState, useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { useStopwatch } from "react-timer-hook";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

import Utils from "./common/Utils";
import { Colors, Sounds } from "./common/Const";

import Dice from "./components/Dice";

import ScoresModal from "./ScoresModal";
import SettingsModal from "./SettingsModal";
import { useGlobalState } from "./common/GlobalState";
import ScoreUtils from "./common/ScoreUtils";

const NumberOfDices = 12;

//TODO: expo-fonts to be integrated
//TODO: Show missed rolls (where selected number was there but user Rolled-away)
//TODO: Save no of rolls & time taken to local storage and show scores table

const Main = () => {
  const CreateANewDice = () => ({
    title: `${Math.ceil(Math.random() * 6)}`,
    isSelected: false,
    id: nanoid(),
  });

  const SetNewDices = () =>
    [...Array(NumberOfDices)].map(() => CreateANewDice());

  const {
    seconds: tSeconds,
    minutes: tMinutes,
    hours: tHours,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useStopwatch({});

  const [noOfRows, setNoOfRows] = useState(2);
  const [allDices, setAllDices] = useState(SetNewDices());
  const [noOfRolls, setNoOfRolls] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isScoresVisible, setIsScoresVisible] = useState(false);

  const [diceType] = useGlobalState("diceType");

  const leftConfettiRef = useRef();
  const rightConfettiRef = useRef();

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
        diceType
      );
    }
  }, [allDices]);

  const increaseNoOfRolls = () => {
    setNoOfRolls((oldNoOfRolls) => oldNoOfRolls + 1);
  };

  const resetNoOfRolls = () => setNoOfRolls(0);

  const startConfettis = () => {
    leftConfettiRef.current.start();
    rightConfettiRef.current.start();
  };

  const onPress_NewGame_or_Roll = () => {
    CheckIfAllDicesAreTheSame() ? onPressNewGame() : onPressRoll();
  };

  const onPressRoll = () => {
    Utils.PlaySound(Sounds.Roll_Dice);
    if (getSelectedDices().length > 0) {
      increaseNoOfRolls();
    }
    setAllDices((oldDice) =>
      oldDice.map((die) => (die.isSelected ? die : CreateANewDice()))
    );
  };

  const onPressNewGame = () => {
    setAllDices(SetNewDices());
    resetTimer();
  };

  const onPressDie = ({ id, title }) => {
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

  const onLayoutRootView = (l) => {
    const { width } = l.nativeEvent.layout;
    if (width <= 480) {
      setNoOfRows(4);
    } else if (width > 480 && width <= 720) {
      setNoOfRows(3);
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
      }}
      onLayout={onLayoutRootView}
    >
      <View
        style={{
          justifyContent: "center",
          width: "90%",
        }}
      >
        <View style={{ margin: 12 }}>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 50 }}
          >
            Tenzies
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 20,
              marginTop: 8,
            }}
          >
            Roll until all dice are the same.{"\n"}Click each die to freeze it
            at its current value between rolls.
          </Text>
          <View style={{ marginTop: 12 }}>
            <Text
              style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}
            >
              {Utils.GetTimerText({ tHours, tMinutes, tSeconds })}
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

        <Text
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: "bold",
            marginTop: 12,
          }}
        >
          {noOfRolls} Rolls
        </Text>

        <View
          style={{
            overflow: "hidden",
            borderRadius: 12,
            marginTop: 20,
            width: "100%",
            maxWidth: 615,
            alignSelf: "center",
          }}
        >
          <TouchableRipple
            style={{
              borderRadius: 12,
              backgroundColor: Colors.ButtonBG,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onPress_NewGame_or_Roll}
          >
            <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
              {CheckIfAllDicesAreTheSame() ? "New Game" : "ROLL"}
            </Text>
          </TouchableRipple>
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
      <View
        style={{
          position: "absolute",
          top: 38,
          right: 0,
          backgroundColor: Colors.Highlight,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          overflow: "hidden",
        }}
      >
        <IconButton
          icon={"cog"}
          color={Colors.ButtonBG}
          style={{ margin: 0, marginRight: 12 }}
          size={30}
          onPress={() => setIsSettingsVisible(true)}
        />
      </View>
      <View
        style={{
          position: "absolute",
          top: 38,
          left: 0,
          backgroundColor: Colors.Highlight,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          overflow: "hidden",
        }}
      >
        <IconButton
          icon={"trophy"}
          color={Colors.ButtonBG}
          style={{ margin: 0, marginLeft: 12 }}
          size={30}
          onPress={() => setIsScoresVisible(true)}
        />
      </View>
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
