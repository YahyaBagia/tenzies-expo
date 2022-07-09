import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import Utils from "./Utils";

const SCORE_STORAGE_KEY = "SCORES";

export default class ScoreUtils {
  static GetAllScores = async () => {
    let strScores = await AsyncStorage.getItem(SCORE_STORAGE_KEY);
    if (!strScores) strScores = "[]";
    return JSON.parse(strScores);
  };

  static AddNewScore = async (time, noOfRolls, selectedDice, diceType) => {
    const scoreObj = {
      id: nanoid(),
      time,
      noOfRolls,
      selectedDice,
      totalSeconds: Utils.GetTotalSecondsOfTimer(time),
      diceType,
    };
    console.log(scoreObj);
    const allScores = await ScoreUtils.GetAllScores();
    allScores.push(scoreObj);
    await ScoreUtils.SaveScores(allScores);
  };

  static DeleteScore = async (scoreObj) => {
    const allScores = await ScoreUtils.GetAllScores();
    const newScores = allScores.filter(({ id }) => id !== scoreObj.id);
    await ScoreUtils.SaveScores(newScores);
  };

  static ClearAllScores = async () => {
    await ScoreUtils.SaveScores([]);
  };

  static SaveScores = async (arrScores) => {
    const strScores = JSON.stringify(arrScores);
    await AsyncStorage.setItem(SCORE_STORAGE_KEY, strScores);
  };
}
