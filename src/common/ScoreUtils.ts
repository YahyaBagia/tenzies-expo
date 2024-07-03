import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import Utils, { ITimerData } from "./Utils";
import { DiceNumber, DiceType } from "../components/Dice/types";
import { GetDiceType } from "./GlobalState";

const SCORE_STORAGE_KEY = "SCORES";

export interface ScoreObject {
  id: string;
  time: ITimerData;
  noOfRolls: number;
  selectedDice: DiceNumber;
  totalSeconds: number;
  diceType: DiceType;
  noOfDices: number;
}

export default class ScoreUtils {
  static GetAllScores = async (): Promise<ScoreObject[]> => {
    const strScores = await AsyncStorage.getItem(SCORE_STORAGE_KEY);
    if (!strScores) return [];
    return JSON.parse(strScores) as ScoreObject[];
  };

  static AddNewScore = async (
    time: ITimerData,
    noOfRolls: number,
    selectedDice: DiceNumber,
    // diceType: DiceType,
    noOfDices: number
  ): Promise<void> => {
    const diceType = GetDiceType();
    const scoreObj: ScoreObject = {
      id: Crypto.randomUUID(),
      time,
      noOfRolls,
      selectedDice,
      totalSeconds: Utils.GetTotalSecondsOfTimer(time),
      diceType,
      noOfDices,
    };
    const allScores = await ScoreUtils.GetAllScores();
    allScores.push(scoreObj);
    await ScoreUtils.SaveScores(allScores);
  };

  static DeleteScore = async (scoreObj: ScoreObject): Promise<void> => {
    const allScores = await ScoreUtils.GetAllScores();
    const newScores = allScores.filter(({ id }) => id !== scoreObj.id);
    await ScoreUtils.SaveScores(newScores);
  };

  static ClearAllScores = async (): Promise<void> => {
    await ScoreUtils.SaveScores([]);
  };

  static SaveScores = async (arrScores: ScoreObject[]): Promise<void> => {
    const strScores = JSON.stringify(arrScores);
    await AsyncStorage.setItem(SCORE_STORAGE_KEY, strScores);
  };
}
