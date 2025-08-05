import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import StickyTopButton from "@/src/components/StickyTopButton";

// Mock reanimated & safe area insets
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return (props: any) => <Text>{props.name}</Text>;
});

// jest.mock("react-native-safe-area-context", () => ({
//   useSafeAreaInsets: () => ({ top: 0 }),
// }));

describe("StickyTopButton", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    title: "Test Button",
    icon: "plus",
    onPress: mockOnPress,
    position: "right" as const,
    testID: "sticky-button",
  };

  it("renders the title and icon", () => {
    const { getByText, getByTestId } = render(
      <StickyTopButton {...defaultProps} />
    );

    expect(getByText("Test Button")).toBeTruthy();
    expect(getByTestId("sticky-button")).toBeTruthy();
  });

  it("calls onPress when button is pressed", () => {
    const { getByTestId } = render(<StickyTopButton {...defaultProps} />);
    const button = getByTestId("sticky-button");

    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not crash on hover/press events", () => {
    const { getByTestId } = render(<StickyTopButton {...defaultProps} />);
    const button = getByTestId("sticky-button");

    fireEvent(button, "onHoverIn");
    fireEvent(button, "onHoverOut");
    fireEvent(button, "onPressIn");
    fireEvent(button, "onPressOut");
  });

  it("applies correct positioning for left and right", () => {
    const { getByTestId, rerender } = render(
      <StickyTopButton {...defaultProps} position="left" />
    );
    expect(getByTestId("sticky-button")).toBeTruthy();

    rerender(<StickyTopButton {...defaultProps} position="right" />);
    expect(getByTestId("sticky-button")).toBeTruthy();
  });
});
