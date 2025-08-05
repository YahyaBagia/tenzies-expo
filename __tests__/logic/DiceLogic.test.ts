import {
  generateDices,
  rollDices,
  toggleDiceSelection,
  checkIfAllSelectedDicesAreTheSame,
} from "@/src/common/DiceLogic";
import { IDiceData } from "@/src/components/Dice/types";

describe("DiceLogic", () => {
  describe("generateDices", () => {
    it("should generate the correct number of dice", () => {
      const dices = generateDices(5);
      expect(dices).toHaveLength(5);
      dices.forEach((dice) => {
        expect(dice).toHaveProperty("id");
        expect(dice).toHaveProperty("number");
        expect(dice).toHaveProperty("isSelected", false);
      });
    });
  });

  describe("rollDices", () => {
    it("should change number of unselected dice and keep selected ones unchanged", () => {
      const initialDices: IDiceData[] = [
        { id: "1", number: "1", isSelected: false },
        { id: "2", number: "2", isSelected: false },
        { id: "3", number: "3", isSelected: false },
        { id: "4", number: "4", isSelected: false },
        { id: "5", number: "5", isSelected: false },
        { id: "6", number: "6", isSelected: true },
      ];

      const rolledDices = rollDices(initialDices);

      // Numbers of dices before and after roll should be different
      const arrUnselectedDiceNumbers = initialDices
        .filter((d) => !d.isSelected)
        .map((d) => d.number)
        .join("-");
      const arrRolledDiceNumbers = rolledDices
        .filter((d) => !d.isSelected)
        .map((d) => d.number)
        .join("-");

      expect(arrRolledDiceNumbers).not.toEqual(arrUnselectedDiceNumbers);

      // Dice 6 should remain unchanged
      const dice6 = rolledDices.find((d) => d.id === "6")!;
      expect(dice6.number).toBe("6");
    });
  });

  describe("toggleDiceSelection", () => {
    const dices: IDiceData[] = [
      { id: "1", number: "3", isSelected: false },
      { id: "2", number: "4", isSelected: false },
    ];
    it("should toggle isSelected flag of the matching dice", () => {
      const toggled = toggleDiceSelection(dices, "1");
      expect(toggled.find((d) => d.id === "1")?.isSelected).toBe(true);

      const untoggled = toggleDiceSelection(toggled, "1");
      expect(untoggled.find((d) => d.id === "1")?.isSelected).toBe(false);
    });

    it("should not affect other dice", () => {
      const toggled = toggleDiceSelection(dices, "1");
      expect(toggled.find((d) => d.id === "2")?.isSelected).toBe(false);
    });
  });

  describe("checkIfAllSelectedDicesAreTheSame", () => {
    it("should return true when all dice numbers are same and selected", () => {
      const dices: IDiceData[] = [
        { id: "1", number: "4", isSelected: true },
        { id: "2", number: "4", isSelected: true },
        { id: "3", number: "4", isSelected: true },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(true);
    });

    it("should return false when none are selected", () => {
      const dices: IDiceData[] = [
        { id: "1", number: "4", isSelected: false },
        { id: "2", number: "4", isSelected: false },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(false);
    });

    it("should return false when not all are selected", () => {
      const dices: IDiceData[] = [
        { id: "1", number: "4", isSelected: true },
        { id: "2", number: "4", isSelected: false },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(false);
    });

    it("should return false when numbers differ", () => {
      const dices: IDiceData[] = [
        { id: "1", number: "4", isSelected: true },
        { id: "2", number: "5", isSelected: true },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(false);
    });
  });
});
