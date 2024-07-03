import { createGlobalState } from "react-hooks-global-state";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DiceType, DiceTypes } from "../components/Dice/types";

interface GlobalState {
  noOfDices: number;
  soundEnabled: boolean;
  diceType: DiceType;
}

const initialState: GlobalState = {
  noOfDices: 12,
  soundEnabled: true,
  diceType: DiceTypes[0],
};

const CACHED_STATE = "CACHED_STATE";

const { useGlobalState, getGlobalState, setGlobalState } =
  createGlobalState(initialState);

//#region - Cachable Global State

export const SetNoOfDices = (value: number): void => {
  setGlobalState("noOfDices", () => value);
  CacheStateLocally();
};

export const SetSoundEnabled = (value: boolean): void => {
  setGlobalState("soundEnabled", () => value);
  CacheStateLocally();
};

export const SetDiceType = (value: DiceType): void => {
  setGlobalState("diceType", () => value);
  CacheStateLocally();
};

//#endregion

//#region - Getters

export const GetNoOfDices = (): number => getGlobalState("noOfDices");

export const GetSoundEnabled = (): boolean => getGlobalState("soundEnabled");

export const GetDiceType = (): DiceType => getGlobalState("diceType");

//#endregion

//#region - Persisting Global State

const CacheStateLocally = async (): Promise<void> => {
  const cacheableState: GlobalState = {
    noOfDices: getGlobalState("noOfDices"),
    soundEnabled: getGlobalState("soundEnabled"),
    diceType: getGlobalState("diceType"),
  };
  const stringifiedState = JSON.stringify(cacheableState);
  await AsyncStorage.setItem(CACHED_STATE, stringifiedState);
};

export const LoadLocallyCachedState = async (): Promise<boolean> => {
  let currentState: GlobalState = { ...initialState };
  const stateKeys = Object.keys(initialState) as Array<keyof GlobalState>;
  const strLocallyCachedState = await AsyncStorage.getItem(CACHED_STATE);
  console.log("strLocallyCachedState", strLocallyCachedState);

  const locallyCachedState = strLocallyCachedState
    ? (JSON.parse(strLocallyCachedState) as Partial<GlobalState>)
    : null;
  if (locallyCachedState !== null) {
    currentState = { ...currentState, ...locallyCachedState };
  }

  for (const key of stateKeys) setGlobalState(key, () => currentState[key]);

  return true;
};

//#endregion

export { useGlobalState, getGlobalState, setGlobalState };
