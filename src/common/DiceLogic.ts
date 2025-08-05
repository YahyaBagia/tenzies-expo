import { IDiceData, DiceNumber } from "@/src/components/Dice/types";

/**
 * Utility to generate a random DiceNumber ("1" to "6").
 */
export const generateRandomDiceTitle = (): DiceNumber => {
  const diceValues: DiceNumber[] = ["1", "2", "3", "4", "5", "6"];
  const randomIndex = Math.floor(Math.random() * diceValues.length);
  return diceValues[randomIndex];
};

/**
 * Generates a new array of dice.
 *
 * @param count - Number of dice to generate
 * @returns An array of dice with random titles
 */
export const generateDices = (count: number): IDiceData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${index}-${Date.now()}`,
    number: generateRandomDiceTitle(),
    isSelected: false,
  }));
};

/**
 * Rolls the dice. Only updates dice that are not selected (i.e., not held).
 *
 * @param dices - Current array of dice
 * @returns A new array with unselected dice updated
 */
export const rollDices = (dices: IDiceData[]): IDiceData[] => {
  return dices.map((dice) =>
    dice.isSelected
      ? dice
      : {
          ...dice,
          number: generateRandomDiceTitle(),
        }
  );
};

/**
 * Toggles the selection state of a dice with a given ID.
 *
 * @param dices - Current dice array
 * @param id - Dice ID to toggle
 * @returns Updated dice array
 */
export const toggleDiceSelection = (
  dices: IDiceData[],
  id: string
): IDiceData[] => {
  return dices.map((dice) =>
    dice.id === id ? { ...dice, isSelected: !dice.isSelected } : dice
  );
};

/**
 * Checks if all dice are selected and have the same title.
 *
 * @param dices - Current dice array
 * @returns True if game is complete (all selected and same value)
 */
export const checkIfAllSelectedDicesAreTheSame = (
  dices: IDiceData[]
): boolean => {
  if (dices.length === 0) return false;

  const allSelected = dices.every((dice) => dice.isSelected);
  const firstValue = dices[0].number;
  const allSameValue = dices.every((dice) => dice.number === firstValue);

  return allSelected && allSameValue;
};
