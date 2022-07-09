import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Dialog,
  Divider,
  Portal,
  Text,
  Title,
  TouchableRipple,
} from "react-native-paper";

import Dice from "./components/Dice";

import Utils from "./common/Utils";
import { Colors } from "./common/Const";
import ScoreUtils from "./common/ScoreUtils";

const ScoresModal = ({ isVisible, onDismiss }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (isVisible) {
      loadScores();
    }
  }, [isVisible]);

  const loadScores = async () => {
    const s = await ScoreUtils.GetAllScores();
    const sortedScores = s.sort((a, b) => a.totalSeconds - b.totalSeconds);
    setScores(sortedScores);
  };

  const onPressClearScoreboard = async () => {
    await ScoreUtils.ClearAllScores();
    await loadScores();
  };

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={onDismiss}
        style={{
          maxWidth: 470,
          width: "85%",
          alignSelf: "center",
          marginVertical: 20,
          marginHorizontal: 15,
          backgroundColor: Colors.Primary,
        }}
      >
        <Dialog.Actions>
          <Title
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Scoreboard
          </Title>
        </Dialog.Actions>
        <Divider />
        <Dialog.ScrollArea>
          <FlatList
            data={scores}
            renderItem={({ item, index }) => (
              <ScoreItem scoreObj={item} index={index} />
            )}
            keyExtractor={({ id }) => id}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                  borderRadius: 12,
                  borderWidth: 3,
                  borderColor: Colors.ButtonBG,
                  padding: 2,
                }}
              >
                <ScoreItemText v={"#"} halfWidth />
                <ScoreItemText v={"Time"} />
                <ScoreItemText v={"Rolls"} />
                <ScoreItemText v={"Dice"} />
              </View>
            )}
          />
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <View
            style={{
              overflow: "hidden",
              borderRadius: 12,
              width: "100%",
              maxWidth: 615,
              alignSelf: "center",
            }}
          >
            <TouchableRipple
              style={{
                borderRadius: 12,
                backgroundColor: Colors.ButtonBG,
                height: 46,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={onPressClearScoreboard}
            >
              <Text
                style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
              >
                Clear Scoreboard
              </Text>
            </TouchableRipple>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const ScoreItem = ({ scoreObj, index }) => {
  const { id, time, noOfRolls, selectedDice, diceType } = scoreObj;
  const timeTaken = Utils.GetTimerText(time);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: Colors.ButtonBG,
        padding: 2,
      }}
    >
      <ScoreItemText v={index + 1} halfWidth />
      <ScoreItemText v={timeTaken} />
      <ScoreItemText v={noOfRolls} />
      <View style={{ flex: 1, alignItems: "center" }}>
        <Dice diceType={diceType} isCompact title={selectedDice} />
      </View>
    </View>
  );
};

const ScoreItemText = ({ v, halfWidth = false }) => (
  <Text
    style={{
      flex: halfWidth ? 0.5 : 1,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 22,
      marginHorizontal: 1,
    }}
  >
    {v}
  </Text>
);

export default ScoresModal;
