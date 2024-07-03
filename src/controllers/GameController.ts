import { useState, useEffect } from "react";
import { Dimensions, LayoutChangeEvent } from "react-native";
import { useStopwatch } from "react-timer-hook";
import * as Crypto from "expo-crypto";

import Utils from "@/src/common/Utils";
import { Sounds } from "@/src/common/Const";
import ScoreUtils from "@/src/common/ScoreUtils";
import useUpdateEffect from "@/src/common/CustomHooks";
import { useGlobalState } from "@/src/common/GlobalState";

import { DiceNumber } from "@/src/components/Dice/types";

interface IDice {
  title: DiceNumber;
  isSelected: boolean;
  id: string;
}

const useGameController = () => {
  const [noOfDices] = useGlobalState("noOfDices");

  const CreateDice = (): IDice => ({
    title: `${Math.ceil(Math.random() * 6)}` as DiceNumber,
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
      pauseTimer();
      ScoreUtils.AddNewScore(
        { tHours, tMinutes, tSeconds },
        noOfRolls,
        selectedDices[0].title,
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

  return {
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
  };
};

export default useGameController;
