import { useState, useEffect, useMemo, useCallback } from "react";
import { Dimensions, LayoutChangeEvent } from "react-native";
import { useStopwatch } from "react-timer-hook";
import * as Crypto from "expo-crypto";

import Utils from "@/src/common/Utils";
import { Sounds } from "@/src/common/Const";
import ScoreUtils from "@/src/common/ScoreUtils";
import useUpdateEffect from "@/src/common/CustomHooks";
import { useGlobalStore, useShallow } from "@/src/common/GlobalStore";

import { DiceNumber } from "@/src/components/Dice/types";

interface IDice {
  title: DiceNumber;
  isSelected: boolean;
  id: string;
}

const useGameController = () => {
  const [noOfDices] = useGlobalStore(useShallow((s) => [s.noOfDices]));

  const CreateDice = (): IDice => ({
    title: `${Math.ceil(Math.random() * 6)}` as DiceNumber,
    isSelected: false,
    id: Crypto.randomUUID(),
  });

  const GenerateNewDices = useCallback(() => {
    return [...Array(noOfDices)].map(() => CreateDice());
  }, [noOfDices]);

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

  // Derived state: true if all dice are selected and have the same number
  const isGameComplete = useMemo(() => {
    const allSelected = allDices.every((die) => die.isSelected);
    const firstValue = allDices[0].title;
    const allSame = allDices.every((die) => die.title === firstValue);
    return allSelected && allSame;
  }, [allDices]);

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
    } else if (isGameComplete) {
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
    setMissedRolls(0);
    setMissedDices(0);
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
    isGameComplete ? onPressNewGame() : onPressRoll();
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
        setMissedRolls((prevMissedRolls) => prevMissedRolls + 1);
        setMissedDices(
          (prevMissedDices) => prevMissedDices + foundUnselected.length
        );
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

  const onPressDice = (dice: IDice) => {
    if (isGameComplete || !isValidDiceSelection(dice)) return;
    Utils.PlaySound(Sounds.Dice_Click);
    setAllDices((oldDices) =>
      oldDices.map((die) =>
        die.id === dice.id ? { ...die, isSelected: !die.isSelected } : die
      )
    );
  };

  const isValidDiceSelection = (dice: IDice): boolean => {
    const [firstSelectedDice] = allDices.filter(({ isSelected }) => isSelected);
    return !firstSelectedDice || firstSelectedDice.title === dice.title;
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
    onPressDice,
    onLayoutRootView,

    // methods
    isGameComplete,

    // modal visibility
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
