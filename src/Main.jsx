import { useState, useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

import Dice from "./components/Dice";
import Timer from "./components/Timer";

import { Colors } from "./common/Const";
import Utils from "./common/Utils";

const NumberOfDices = 12;

//TODO: Settings Modal to be added -> Theme Selector & Number/DiceDots View
//TODO: expo-fonts tobe integrated
//TODO: Show rolls counter
//TODO: Save scores (rolls & time) and show the best

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

  const GetDiceElements = () => {
    const diceElements = allDices.map(({ id, title, isSelected }, index) => (
      <Dice
        key={id}
        title={title}
        isSelected={isSelected}
        onPress={() => onPressDie(allDices[index])}
      />
    ));

    let splittedArrays = [];
    if (Utils.IsOnWeb()) {
      splittedArrays = Utils.SplitArray(diceElements, 2);
    } else {
      splittedArrays = Utils.SplitArray(diceElements, 4);
    }
    return splittedArrays;
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.Primary,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          width: Utils.IsOnWeb() ? undefined : "90%",
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
          {GetDiceElements().map((dices, i) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 8,
                minWidth: Utils.IsOnWeb() ? 400 : "100%",
                maxWidth: 650,
                width: "100%",
              }}
              key={`${i}`}
            >
              {dices}
            </View>
          ))}
        </View>
        <TouchableRipple
          style={{
            borderRadius: 12,
            backgroundColor: Colors.ButtonBG,
            height: 60,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={CheckIfAllDicesAreTheSame() ? onPressNewGame : onPressRoll}
        >
          <Text style={{ color: "white", fontSize: 30 }}>
            {CheckIfAllDicesAreTheSame() ? "New Game" : "Roll"}
          </Text>
        </TouchableRipple>
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
