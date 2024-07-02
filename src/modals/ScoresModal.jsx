import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Dialog,
  Portal,
  Text,
  Title,
  TouchableRipple,
} from "react-native-paper";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Dice from "@/src/components/Dice";
import Separator from "@/src/components/Separator";

import Utils from "@/src/common/Utils";
import ScoreUtils from "@/src/common/ScoreUtils";
import { Colors, FontNames } from "@/src/common/Const";
import { useGlobalState } from "@/src/common/GlobalState";

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
          backgroundColor: Colors.Primary,
        }}
      >
        <Dialog.ScrollArea style={{ borderColor: "transparent" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Title
              style={{
                flex: 1,
                fontSize: 26,
                fontFamily: FontNames.MouldyCheese,
                textAlign: "center",
              }}
            >
              Scoreboard
            </Title>
          </View>
          <Separator />
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
                  fontFamily: FontNames.MouldyCheese,
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
                style={{
                  color: "white",
                  fontSize: 22,
                  fontFamily: FontNames.MouldyCheese,
                }}
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
      fontFamily: FontNames.MouldyCheese,
      fontSize: 22,
      marginHorizontal: 1,
    }}
  >
    {v}
  </Text>
);

export default ScoresModal;
