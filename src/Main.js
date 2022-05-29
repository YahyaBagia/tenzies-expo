import { useState, useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { nanoid } from "nanoid";

import Dice from "./components/Dice";
import Timer from "./components/Timer";
import { Colors } from "./common/const";

const NumberOfDices = 12;


const Main = () => {
  const CreateANewDice = () => ({
    title: `${Math.ceil(Math.random() * 6)}`,
    isSelected: false,
    id: nanoid(),
  });
  const SetNewDices = () =>
    [...Array(NumberOfDices)].map(() => CreateANewDice());

  const [allDices, setAllDices] = useState(SetNewDices());

  const timerRef = useRef();

  const leftConfettiRef = useRef();
  const rightConfettiRef = useRef();

  useEffect(() => {
    const res = allDices.filter((die) => die.isSelected);
    if (res.length === 0) {
      timerRef.current.resetTimer();
    } else if (res.length === 1) {
      timerRef.current.startTimer();
    } else if (CheckIfAllDicesAreTheSame()) {
      startConfettis();
      timerRef.current.pauseTimer();
    }
  }, [allDices]);

  const startConfettis = () => {
    leftConfettiRef.current.start();
    rightConfettiRef.current.start();
  };

  const onPressRoll = () => {
    setAllDices((oldDice) =>
      oldDice.map((die) => (die.isSelected ? die : CreateANewDice()))
    );
  };

  const onPressNewGame = () => {
    setAllDices(SetNewDices());
    timerRef.current.resetTimer();
  };

  const onPressDie = ({ id, title }) => {
    if (CheckIfAllDicesAreTheSame()) return;
    const [firstSelectedDice] = allDices.filter(({ isSelected }) => isSelected);
    if (firstSelectedDice) {
      if (title !== firstSelectedDice.title) return;
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

  const diceElements = allDices.map(({ id, title, isSelected }, index) => (
    <Dice
      key={id}
      title={title}
      isSelected={isSelected}
      onPress={() => onPressDie(allDices[index])}
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
          <View style={{ margin: 12 }}>
            <Timer ref={timerRef} />
          </View>
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
            style={{ backgroundColor: "#596183", borderRadius: 12 }}
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
