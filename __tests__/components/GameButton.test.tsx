import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GameButton from "@/src/components/GameButton";

// Mock the constants
jest.mock("@/src/common/Const", () => ({
  Colors: {
    Highlight: "#ff6b6b",
    ButtonBG: "#4ecdc4",
  },
  FontNames: {
    MouldyCheese: "MouldyCheese",
  },
}));

// Import the mocked constants for use in tests
import { Colors } from "@/src/common/Const";

describe("GameButton", () => {
  const mockOnPress = jest.fn();
  const defaultProps = {
    title: "Test Button",
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe("Rendering", () => {
    it("renders correctly with required props", () => {
      const { getByText } = render(<GameButton {...defaultProps} />);

      expect(getByText("Test Button")).toBeTruthy();
    });

    it("renders with custom testID when provided", () => {
      const { getByTestId } = render(
        <GameButton {...defaultProps} testID="game-button" />
      );

      expect(getByTestId("game-button")).toBeTruthy();
    });
  });

  // Interaction Tests
  describe("Interactions", () => {
    it("calls onPress when button is pressed", () => {
      const { getByText } = render(<GameButton {...defaultProps} />);

      fireEvent.press(getByText("Test Button"));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("calls onPress multiple times when pressed multiple times", () => {
      const { getByText } = render(<GameButton {...defaultProps} />);
      const button = getByText("Test Button");

      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  // Styling/Props Tests
  describe("Styling", () => {
    it("applies default styling when invertedColors is false", () => {
      const { getByTestId } = render(
        <GameButton {...defaultProps} testID="game-button" />
      );

      const button = getByTestId("game-button");
      const style: Array<any> = button.props.style;
      const flattenStyle = style.flat();
      expect(flattenStyle).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: Colors.ButtonBG,
            borderColor: "transparent",
          }),
        ])
      );
    });

    it("applies inverted styling when invertedColors is true", () => {
      const { getByTestId } = render(
        <GameButton
          {...defaultProps}
          invertedColors={true}
          testID="game-button"
        />
      );

      const button = getByTestId("game-button");
      const style: Array<any> = button.props.style;
      const flattenStyle = style.flat();
      expect(flattenStyle).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: Colors.Highlight,
            borderColor: Colors.ButtonBG,
          }),
        ])
      );
    });

    it("applies correct text color for default state", () => {
      const { getByText } = render(<GameButton {...defaultProps} />);

      const text = getByText("Test Button");
      const style: Array<any> = text.props.style;
      const flattenStyle = style.flat();
      expect(flattenStyle).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: "white",
          }),
        ])
      );
    });

    it("applies correct text color for inverted state", () => {
      const { getByText } = render(
        <GameButton {...defaultProps} invertedColors={true} />
      );

      const text = getByText("Test Button");
      const style: Array<any> = text.props.style;
      const flattenStyle = style.flat();
      expect(flattenStyle).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: Colors.ButtonBG,
          }),
        ])
      );
    });
  });

  // Accessibility Tests
  describe("Accessibility", () => {
    it("has correct accessibility properties", () => {
      const { getByText } = render(<GameButton {...defaultProps} />);

      const text = getByText("Test Button");
      expect(text.props.selectable).toBe(false);
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles empty title gracefully", () => {
      const { getByTestId } = render(
        <GameButton title="" onPress={mockOnPress} testID="empty-button" />
      );

      expect(getByTestId("empty-button")).toBeTruthy();
    });

    it("handles long title text", () => {
      const longTitle =
        "This is a very long button title that might cause layout issues";
      const { getByText } = render(
        <GameButton title={longTitle} onPress={mockOnPress} />
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles special characters in title", () => {
      const specialTitle = "Button with 🎮 emoji & symbols!";
      const { getByText } = render(
        <GameButton title={specialTitle} onPress={mockOnPress} />
      );

      expect(getByText(specialTitle)).toBeTruthy();
    });
  });
});
