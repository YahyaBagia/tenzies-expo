import { render, fireEvent } from "@testing-library/react-native";

import Dice from "@/src/components/Dice";
import { IDiceData } from "@/src/components/Dice/types";

describe("Dice", () => {
  const mockDice: IDiceData = {
    id: "1",
    number: "4",
    isSelected: false,
  };

  it("renders correctly", () => {
    const { getByText } = render(
      <Dice diceData={mockDice} diceType="Digit" onPress={() => {}} />
    );
    expect(getByText("4")).toBeTruthy();
  });

  it("calls onPress with correct ID", () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <Dice diceData={mockDice} diceType="Digit" onPress={onPressMock} />
    );

    fireEvent.press(getByTestId("dice-1"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
