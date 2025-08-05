export type TDiceType = "Digit" | "Symbol";

export const DiceTypes: TDiceType[] = ["Digit", "Symbol"] as const;

export type DiceType = (typeof DiceTypes)[number];

export type DiceNumber = "1" | "2" | "3" | "4" | "5" | "6";

export interface IDiceData {
  number: DiceNumber;
  isSelected: boolean;
  id: string;
}

export interface DotPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export type DiceFaceConfig = DotPosition[];
