import { useState, useRef } from "react";
import { View, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { nanoid } from "nanoid";

import Dice from "./components/Dice";
import { Colors } from "./common/const";

const NumberOfDices = 12;

// SHOW TIMER | START ON FIRST DICE PRESS | END ON CheckIfAllDicesAreTheSame | RESET IF NO DIE IS SELECTED
// PREVENT SELECTING OTHER NUMBER DICE ONCE ATLEAST ONE DIE IS SELECTED

const Main = () => {
  const CreateANewDice = () => ({
    title: `${Math.ceil(Math.random() * 6)}`,
    isSelected: false,
    id: nanoid(),
  });
  const SetNewDices = () =>
    [...Array(NumberOfDices)].map(() => CreateANewDice());

  const [allDices, setAllDices] = useState(SetNewDices());

  const leftConfettiRef = useRef();
  const rightConfettiRef = useRef();

  const startConfettis = () => {
    leftConfettiRef.current.start();
    rightConfettiRef.current.start();
  };

  const onPressRoll = () => {
    setAllDices((oldDice) =>
      oldDice.map((die) => (die.isSelected ? die : CreateANewDice()))
    );
  };

  const onPressNewGame = () => setAllDices(SetNewDices());

  const onPressDie = (id) => {
    if (CheckIfAllDicesAreTheSame()) {
      startConfettis();
      return;
    }
    setAllDices((oldDices) =>
      oldDices.map((die) =>
        die.id === id ? { ...die, isSelected: !die.isSelected } : die
      )
    );
  };

  const CheckIfAllDicesAreTheSame = () => {
    const allSelected = allDices.every((die) => die.isSelected);
    const firstValue = allDices[0].title;
    const allSame = allDices.every((die) => die.title === firstValue);
    return allSelected && allSame;
  };

  const diceElements = allDices.map(({ id, title, isSelected }) => (
    <Dice
      key={id}
      title={title}
      isSelected={isSelected}
      onPress={() => onPressDie(id)}
    />
  ));

  const middleIndexOfDices = NumberOfDices / 2;
  const firstHalfDices = diceElements.splice(0, middleIndexOfDices);
  const secondHalfDices = diceElements.splice(-middleIndexOfDices);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.ScreenBG,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: Colors.Primary,
          borderRadius: 12,
          justifyContent: "center",
          padding: 30,
          width: "85%",
        }}
      >
        <View style={{ margin: 12 }}>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 50 }}
          >
            Tenzies
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 20,
              marginTop: 8,
            }}
          >
            Roll until all dice are the same.{"\n"}Click each die to freeze it
            at its current value between rolls.
          </Text>
        </View>

        <View style={{ alignItems: "center", marginVertical: 28 }}>
          {[firstHalfDices, secondHalfDices].map((dices, i) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 8,
                minWidth: 400,
                maxWidth: 650,
                width: "100%",
              }}
              key={`${i}`}
            >
              {dices}
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Button
            onPress={CheckIfAllDicesAreTheSame() ? onPressNewGame : onPressRoll}
            style={{ backgroundColor: "#596183" }}
            labelStyle={{ color: "white", fontSize: 22 }}
            contentStyle={{ height: 50, width: 180 }}
            uppercase={false}
          >
            {CheckIfAllDicesAreTheSame() ? "New Game" : "Roll"}
          </Button>
        </View>
      </View>
      {CheckIfAllDicesAreTheSame() && (
        <>
          <ConfettiCannon
            count={50}
            origin={{ x: 100, y: 100 }}
            autoStart={true}
            ref={leftConfettiRef}
            onAnimationEnd={startConfettis}
            fadeOut={true}
          />
          <ConfettiCannon
            count={50}
            origin={{ x: Dimensions.get("window").width - 100, y: 100 }}
            autoStart={true}
            ref={rightConfettiRef}
            onAnimationEnd={startConfettis}
            fadeOut={true}
          />
        </>
      )}
    </View>
  );
};

export default Main;
