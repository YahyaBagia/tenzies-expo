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
import SegmentedControlTab from "react-native-segmented-control-tab";

import Dice from "./components/Dice";

import Utils from "./common/Utils";
import { Colors } from "./common/Const";
import ScoreUtils from "./common/ScoreUtils";
import { useGlobalState } from "./common/GlobalState";

const arrNoOfDices = [4, 6, 8, 10, 12];

const ScoresModal = ({ isVisible, onDismiss }) => {
  const [diceType] = useGlobalState("diceType");

  const [scores, setScores] = useState([]);
  const [selectedNoOfDices, setSelectedNoOfDices] = useState(
    arrNoOfDices[arrNoOfDices.length - 1]
  );

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
          maxHeight: 680,
          width: "92%",
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Dice title={"5"} isCompact diceType={diceType} />
            <View style={{ flex: 1, marginHorizontal: 4 }}>
              <SegmentedControlTab
                values={arrNoOfDices.map((v) => `${v}`)}
                selectedIndex={arrNoOfDices.indexOf(selectedNoOfDices)}
                onTabPress={(i) => setSelectedNoOfDices(arrNoOfDices[i])}
                borderRadius={12}
                tabStyle={{ borderWidth: 3, borderColor: Colors.Highlight }}
                activeTabStyle={{ backgroundColor: Colors.ButtonBG }}
                tabTextStyle={{
                  color: Colors.ButtonBG,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              />
            </View>
            <Dice title={"5"} isCompact diceType={diceType} />
          </View>
          <FlatList
            data={scores.filter(
              ({ noOfDices }) => noOfDices === selectedNoOfDices
            )}
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
