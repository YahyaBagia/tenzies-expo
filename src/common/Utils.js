import { Platform } from "react-native";
import { Audio } from "expo-av";

import { getGlobalState } from "./GlobalState";

export default class Utils {
  static SplitArray = (flatArray, numCols) => {
    const newArray = [];
    for (let c = 0; c < numCols; c++) {
      newArray.push([]);
    }
    for (let i = 0; i < flatArray.length; i++) {
      const mod = i % numCols;
      newArray[mod].push(flatArray[i]);
    }
    return newArray;
  };

  static Sleep = (seconds = 1) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  };

  static PlaySound = async (audio) => {
    try {
      const soundEnabled = getGlobalState("soundEnabled");
      if (!soundEnabled) return;
      const { sound } = await Audio.Sound.createAsync(audio);
      await sound.playAsync();
    } catch {}
  };

  static IsOnWeb = () => Platform.OS === "web";

  //#region
  static GetTimerText = ({ tHours, tMinutes, tSeconds }) => {
    const twoDigitNumber = (n) => ("0" + n).slice(-2);
    let formattedTime =
      twoDigitNumber(tMinutes) + ":" + twoDigitNumber(tSeconds);
    if (tHours > 0) {
      formattedTime = twoDigitNumber(tHours) + ":" + formattedTime;
    }
    return formattedTime;
  };

  static GetTotalSecondsOfTimer = ({ tHours, tMinutes, tSeconds }) => {
    const hSeconds = Number(tHours) * 3600;
    const mSeconds = Number(tMinutes) * 60;
    const sSeconds = Number(tSeconds);
    const totalSeconds = hSeconds + mSeconds + sSeconds;
    return totalSeconds;
  };
  //#endregion
}
