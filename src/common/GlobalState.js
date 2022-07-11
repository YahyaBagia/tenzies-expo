import { createGlobalState } from "react-hooks-global-state";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DiceTypes = ["Digit", "Symbol"];

const initialState = {
  noOfDices: 12,
  soundEnabled: true,
  diceType: DiceTypes[0],
};

const CACHED_STATE = "CACHED_STATE";

const { useGlobalState, getGlobalState, setGlobalState } =
  createGlobalState(initialState);

//#region - Cachable Global State

export const SetNoOfDices = (value) => {
  setGlobalState("noOfDices", (v) => value);
  CacheStateLocally();
};

export const SetSoundEnabled = (value) => {
  setGlobalState("soundEnabled", (v) => value);
  CacheStateLocally();
};

export const SetDiceType = (value) => {
  setGlobalState("diceType", (v) => value);
  CacheStateLocally();
};

//#endregion

//#region - Persisting Global State

const CacheStateLocally = async () => {
  let cacheableState = {
    noOfDices: getGlobalState("noOfDices"),
    soundEnabled: getGlobalState("soundEnabled"),
    diceType: getGlobalState("diceType"),
  };
  cacheableState = JSON.stringify(cacheableState);
  await AsyncStorage.setItem(CACHED_STATE, cacheableState);
};

export const LoadLocallyCachedState = async () => {
  let currentState = { ...initialState };
  const stateKeys = Object.keys(initialState);
  const strLocallyCachedState = await AsyncStorage.getItem(CACHED_STATE);
  const locallyCachedState = JSON.parse(strLocallyCachedState);
  if (locallyCachedState !== null || locallyCachedState !== undefined) {
    currentState = { ...currentState, ...locallyCachedState };
  }

  for (const key of stateKeys) setGlobalState(key, (v) => currentState[key]);

  return true;
};

//#endregion

export { useGlobalState, getGlobalState, setGlobalState };
