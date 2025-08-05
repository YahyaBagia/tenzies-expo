import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Dialog, Portal, Text, TouchableRipple } from "react-native-paper";
import SegmentedControlTab from "react-native-segmented-control-tab";

import ScoreItem from "./components/ScoreItem";
import ScoreItemText from "./components/ScoreItemText";

import Dice from "@/src/components/Dice";
import Separator from "@/src/components/Separator";

import { Colors, FontNames } from "@/src/common/Const";
import ScoreUtils, { ScoreObject } from "@/src/common/ScoreUtils";

const arrNoOfDices = [4, 6, 8, 10, 12];

interface IScoresModalProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const ScoresModal: React.FC<IScoresModalProps> = ({ isVisible, onDismiss }) => {
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
      <Dialog visible={isVisible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.title}>
              Scoreboard
            </Text>
          </View>
          <Separator />
          <View style={styles.segmentedControlContainer}>
            <Dice
              diceData={{ id: "5", number: "5", isSelected: false }}
              isCompact
            />
            <View style={styles.segmentedControlWrapper}>
              <SegmentedControlTab
                values={arrNoOfDices.map((v) => `${v}`)}
                selectedIndex={arrNoOfDices.indexOf(selectedNoOfDices)}
                onTabPress={(i) => setSelectedNoOfDices(arrNoOfDices[i])}
                borderRadius={12}
                tabStyle={styles.segmentedControlTab}
                activeTabStyle={styles.segmentedControlActiveTab}
                tabTextStyle={styles.segmentedControlTabText}
              />
            </View>
            <Dice
              diceData={{ id: "5", number: "5", isSelected: false }}
              isCompact
            />
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
              <View style={styles.listHeader}>
                <ScoreItemText value={"#"} compact />
                <ScoreItemText value={"Time"} />
                <ScoreItemText value={"Rolls"} />
                <ScoreItemText value={"Dice"} />
              </View>
            )}
          />
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <View style={styles.clearButtonContainer}>
            <TouchableRipple
              style={styles.clearButton}
              onPress={onPressClearScoreboard}
            >
              <Text style={styles.clearButtonText}>Clear Scoreboard</Text>
            </TouchableRipple>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxWidth: 470,
    maxHeight: 680,
    width: "92%",
    alignSelf: "center",
    backgroundColor: Colors.Primary,
  },
  scrollArea: {
    borderColor: "transparent",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontFamily: FontNames.MouldyCheese,
    textAlign: "center",
  },
  segmentedControlContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  segmentedControlWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  segmentedControlTab: {
    borderWidth: 3,
    borderColor: Colors.Highlight,
  },
  segmentedControlActiveTab: {
    backgroundColor: Colors.ButtonBG,
  },
  segmentedControlTabText: {
    color: Colors.ButtonBG,
    fontFamily: FontNames.MouldyCheese,
    fontSize: 20,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.ButtonBG,
    padding: 2,
  },
  clearButtonContainer: {
    overflow: "hidden",
    borderRadius: 12,
    width: "100%",
    maxWidth: 615,
    alignSelf: "center",
  },
  clearButton: {
    borderRadius: 12,
    backgroundColor: Colors.ButtonBG,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 22,
    fontFamily: FontNames.MouldyCheese,
  },
});

export default ScoresModal;
