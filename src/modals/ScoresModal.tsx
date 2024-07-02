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

import ScoreItem from "./components/ScoreItem";
import ScoreItemText from "./components/ScoreItemText";

import Dice from "@/src/components/Dice";
import Separator from "@/src/components/Separator";

import { Colors, FontNames } from "@/src/common/Const";
import { useGlobalState } from "@/src/common/GlobalState";
import ScoreUtils, { ScoreObject } from "@/src/common/ScoreUtils";

const arrNoOfDices = [4, 6, 8, 10, 12];

interface IScoresModalProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const ScoresModal: React.FC<IScoresModalProps> = ({ isVisible, onDismiss }) => {
  const [diceType] = useGlobalState("diceType");

  const [scores, setScores] = useState<ScoreObject[]>([]);
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
              <ScoreItem score={item} index={index} />
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
                <ScoreItemText value={"#"} compact />
                <ScoreItemText value={"Time"} />
                <ScoreItemText value={"Rolls"} />
                <ScoreItemText value={"Dice"} />
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

export default ScoresModal;
