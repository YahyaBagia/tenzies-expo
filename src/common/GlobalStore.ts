import { create } from "zustand";
export { useShallow } from "zustand/react/shallow";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DiceType, DiceTypes } from "@/src/components/Dice/types";

const CACHED_STATE = "CACHED_STATE";

interface GlobalStore {
  noOfDices: number;
  soundEnabled: boolean;
  diceType: DiceType;

  // Updaters
  setNoOfDices: (noOfDices: number) => void;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setDiceType: (diceType: DiceType) => void;

  // Persistence
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
}

// Zustand store
export const useGlobalStore = create<GlobalStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial values
        noOfDices: 12,
        soundEnabled: true,
        diceType: DiceTypes[0],

        // Setters
        setNoOfDices: (noOfDices) => set({ noOfDices }),
        setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
        setDiceType: (diceType) => set({ diceType }),

        // Persistence
        isReady: false,
        setIsReady: (isReady) => set({ isReady }),
      }),
      {
        name: CACHED_STATE,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => {
          return {
            noOfDices: state.noOfDices,
            soundEnabled: state.soundEnabled,
            diceType: state.diceType,
            // isReady omitted because it is just a flag
          };
        },
        onRehydrateStorage: () => (s) => {
          s?.setIsReady(true);
        },
      }
    )
  )
);
