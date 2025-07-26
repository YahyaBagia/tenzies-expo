import {
  generateDices,
  rollDices,
  toggleDiceSelection,
  checkIfAllSelectedDicesAreTheSame,
} from "@/src/common/DiceLogic";
import { IDice } from "@/src/components/Dice/types";

describe("DiceLogic", () => {
  describe("generateDices", () => {
    it("should generate the correct number of dice", () => {
      const dices = generateDices(5);
      expect(dices).toHaveLength(5);
      dices.forEach((dice) => {
        expect(dice).toHaveProperty("id");
        expect(dice).toHaveProperty("title");
        expect(dice).toHaveProperty("isSelected", false);
      });
    });
  });

  describe("rollDices", () => {
    it("should change title of unselected dice and keep selected ones unchanged", () => {
      const initialDices: IDice[] = [
        { id: "1", title: "1", isSelected: false },
        { id: "2", title: "2", isSelected: false },
        { id: "3", title: "3", isSelected: false },
        { id: "4", title: "4", isSelected: false },
        { id: "5", title: "5", isSelected: false },
        { id: "6", title: "6", isSelected: true },
      ];

      const rolledDices = rollDices(initialDices);

      // Titles of dices before and after roll should be different
      const arrUnselectedDiceTitles = initialDices
        .filter((d) => !d.isSelected)
        .map((d) => d.title)
        .join("-");
      const arrRolledDiceTitles = rolledDices
        .filter((d) => !d.isSelected)
        .map((d) => d.title)
        .join("-");

      console.log({
        arrUnselectedDiceTitles,
        arrRolledDiceTitles,
      });

      expect(arrRolledDiceTitles).not.toEqual(arrUnselectedDiceTitles);

      // Dice 6 should remain unchanged
      const dice6 = rolledDices.find((d) => d.id === "6")!;
      expect(dice6.title).toBe("6");
    });
  });

  describe("toggleDiceSelection", () => {
    const dices: IDice[] = [
      { id: "1", title: "3", isSelected: false },
      { id: "2", title: "4", isSelected: false },
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
    it("should return true when all dice titles are same and selected", () => {
      const dices: IDice[] = [
        { id: "1", title: "4", isSelected: true },
        { id: "2", title: "4", isSelected: true },
        { id: "3", title: "4", isSelected: true },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(true);
    });

    it("should return false when none are selected", () => {
      const dices: IDice[] = [
        { id: "1", title: "4", isSelected: false },
        { id: "2", title: "4", isSelected: false },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(false);
    });

    it("should return false when not all are selected", () => {
      const dices: IDice[] = [
        { id: "1", title: "4", isSelected: true },
        { id: "2", title: "4", isSelected: false },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(false);
    });

    it("should return false when titles differ", () => {
      const dices: IDice[] = [
        { id: "1", title: "4", isSelected: true },
        { id: "2", title: "5", isSelected: true },
      ];
      expect(checkIfAllSelectedDicesAreTheSame(dices)).toBe(false);
    });
  });
});
