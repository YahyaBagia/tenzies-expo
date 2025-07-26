import { Platform } from "react-native";
import { AudioSource, createAudioPlayer } from "expo-audio";
import { useGlobalStore } from "./GlobalStore";

export interface ITimerData {
  tHours: number;
  tMinutes: number;
  tSeconds: number;
}

export default class Utils {
  static SplitArray = <T>(flatArray: T[], numCols: number): T[][] => {
    const newArray: T[][] = Array.from({ length: numCols }, () => []);
    for (let i = 0; i < flatArray.length; i++) {
      const mod = i % numCols;
      newArray[mod].push(flatArray[i]);
    }
    return newArray;
  };

  static Sleep = (seconds: number = 1): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  };

  static PlaySound = (audioSource: AudioSource): void => {
    const soundEnabled = useGlobalStore.getState().soundEnabled;
    if (!soundEnabled) return;
    const player = createAudioPlayer(audioSource, 100);
    player.play();

    // Not working
    // player.addListener("playbackStatusUpdate", (status) => {
    //   if (status.didJustFinish) player.remove();
    // });

    const removeAfter = 3; // player.duration isn't working as it is set to NaN
    Utils.Sleep(removeAfter).then(() => player.remove());
  };

  static IsOnWeb = (): boolean => Platform.OS === "web";

  //#region
  static GetTimerText = ({
    tHours,
    tMinutes,
    tSeconds,
  }: ITimerData): string => {
    const twoDigitNumber = (n: number): string => ("0" + n).slice(-2);
    let formattedTime =
      twoDigitNumber(tMinutes) + ":" + twoDigitNumber(tSeconds);
    if (tHours > 0) {
      formattedTime = twoDigitNumber(tHours) + ":" + formattedTime;
    }
    return formattedTime;
  };

  static GetTotalSecondsOfTimer = ({
    tHours,
    tMinutes,
    tSeconds,
  }: ITimerData): number => {
    const hSeconds = Number(tHours) * 3600;
    const mSeconds = Number(tMinutes) * 60;
    const sSeconds = Number(tSeconds);
    const totalSeconds = hSeconds + mSeconds + sSeconds;
    return totalSeconds;
  };
  //#endregion
}
