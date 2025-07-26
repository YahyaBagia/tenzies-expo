import { useState, useEffect, useMemo } from "react";
import { Dimensions, LayoutChangeEvent } from "react-native";
import { useStopwatch } from "react-timer-hook";

import Utils from "@/src/common/Utils";
import { Sounds } from "@/src/common/Const";
import ScoreUtils from "@/src/common/ScoreUtils";
import useUpdateEffect from "@/src/hooks/useUpdateEffect";
import { useGlobalStore, useShallow } from "@/src/common/GlobalStore";
import {
  generateDices,
  rollDices,
  toggleDiceSelection,
  checkIfAllSelectedDicesAreTheSame,
} from "@/src/common/DiceLogic";

import { IDice } from "@/src/components/Dice/types";

export const useGameController = () => {
  const [noOfDices] = useGlobalStore(useShallow((s) => [s.noOfDices]));

  const {
    seconds: tSeconds,
    minutes: tMinutes,
    hours: tHours,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useStopwatch({});

  const [noOfRows, setNoOfRows] = useState(2);

  const [allDices, setAllDices] = useState<IDice[]>(generateDices(noOfDices));
  const [noOfRolls, setNoOfRolls] = useState(0);

  const [missedRolls, setMissedRolls] = useState(0);
  const [missedDices, setMissedDices] = useState(0);

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isScoresVisible, setIsScoresVisible] = useState(false);

  const isGameComplete = useMemo(() => {
    return checkIfAllSelectedDicesAreTheSame(allDices);
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
    setAllDices(generateDices(noOfDices));
    pauseTimer();
    resetTimer();
    calculateNoOfRows();
  }, [noOfDices]);

  const increaseNoOfRolls = () => {
    setNoOfRolls((old) => old + 1);
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
      const missed = allDices.filter(
        ({ title: t, isSelected }) => t === title && !isSelected
      );
      if (missed.length > 0) {
        setMissedRolls((prev) => prev + 1);
        setMissedDices((prev) => prev + missed.length);
      }
    }

    setAllDices((prev) => rollDices(prev));
  };

  const onPressNewGame = () => {
    setMissedRolls(0);
    setMissedDices(0);
    setAllDices(generateDices(noOfDices));
    resetTimer();
  };

  const onPressDice = (dice: IDice) => {
    if (isGameComplete || !isValidDiceSelection(dice)) return;
    Utils.PlaySound(Sounds.Dice_Click);
    setAllDices((prev) => toggleDiceSelection(prev, dice.id));
  };

  const isValidDiceSelection = (dice: IDice): boolean => {
    const [firstSelected] = allDices.filter((d) => d.isSelected);
    return !firstSelected || firstSelected.title === dice.title;
  };

  const onLayoutRootView = (layoutChangeEvent: LayoutChangeEvent) => {
    const { width } = layoutChangeEvent.nativeEvent.layout;
    calculateNoOfRows(width);
  };

  const calculateNoOfRows = (width = Dimensions.get("window").width) => {
    if (noOfDices === 10) {
      setNoOfRows(width <= 480 ? 5 : 2);
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
