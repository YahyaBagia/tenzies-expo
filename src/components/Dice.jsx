import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Colors } from "../common/Const";
import { DiceTypes } from "../common/GlobalState";

const Dice = ({ title, isSelected, onPress, isCompact, diceType }) => {
  const diceSize = isCompact ? 50 : 70;
  return (
    <View style={{ overflow: "hidden", borderRadius: 12 }}>
      <TouchableRipple
        onPress={onPress}
        style={{
          borderRadius: 12,
          backgroundColor: isSelected ? Colors.Highlight : "white",
          borderColor: Colors.Highlight,
          borderWidth: 3,
          height: diceSize,
          width: diceSize,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {diceType === DiceTypes[0] ? (
          <DiceDigit title={title} isCompact={isCompact} />
        ) : (
          <DiceSymbol title={title} isCompact={isCompact} />
        )}
      </TouchableRipple>
    </View>
  );
};

const DiceDigit = ({ title, isCompact }) => {
  const diceFontSize = isCompact ? 32 : 45;
  return (
    <Text style={{ fontSize: diceFontSize, fontWeight: "bold" }}>{title}</Text>
  );
};

const DiceSymbol = ({ title, isCompact }) => {
  const dotSize = isCompact ? 10 : 15;

  const one = <DiceDot dotSize={dotSize} />;
  const two = (
    <>
      <DiceDot
        dotSize={dotSize}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <DiceDot
        dotSize={dotSize}
        style={{ position: "absolute", bottom: 0, right: 0 }}
      />
    </>
  );
  const two_mirror = (
    <>
      <DiceDot
        dotSize={dotSize}
        style={{ position: "absolute", top: 0, right: 0 }}
      />
      <DiceDot
        dotSize={dotSize}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      />
    </>
  );
  const two_middle = (
    <>
      <DiceDot
        dotSize={dotSize}
        style={{ position: "absolute", right: 0 }}
      />
      <DiceDot
        dotSize={dotSize}
        style={{ position: "absolute", left: 0 }}
      />
    </>
  )
  const three = (
    <>
      {one}
      {two}
    </>
  );
  const four = (
    <>
      {two}
      {two_mirror}
    </>
  )
  const five = (
    <>
      {one}
      {four}
    </>
  )
  const six = (
    <>
      {four}
      {two_middle}
    </>
  )

  return (
    <View
      style={{
        height: "90%",
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {title === "1" && one}
      {title === "2" && two}
      {title === "3" && three}
      {title === "4" && four}
      {title === "5" && five}
      {title === "6" && six}
    </View>
  );
};

const DiceDot = ({ dotSize, style }) => (
  <View
    style={{
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
      backgroundColor: Colors.ButtonBG,
      ...style,
    }}
  />
);

export default Dice;
