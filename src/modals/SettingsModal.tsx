import { View, StyleSheet } from "react-native";
import { Dialog, Portal, Text, Title } from "react-native-paper";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Dice from "@/src/components/Dice";
import Separator from "@/src/components/Separator";
import StepperButton from "./components/StepperButton";

import { Colors, FontNames } from "@/src/common/Const";
import {
  useGlobalState,
  SetNoOfDices,
  SetDiceType,
  SetSoundEnabled,
} from "@/src/common/GlobalState";
import { DiceTypes } from "../components/Dice/types";

interface ISettingsModalProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const SettingsModal: React.FC<ISettingsModalProps> = ({
  isVisible,
  onDismiss,
}) => {
  const [noOfDices] = useGlobalState("noOfDices");
  const [diceType] = useGlobalState("diceType");
  const [soundEnabled] = useGlobalState("soundEnabled");

  const decreaseNoOfDices = () => {
    if (noOfDices > 4) SetNoOfDices(noOfDices - 2);
  };

  const increaseNoOfDices = () => {
    if (noOfDices < 12) SetNoOfDices(noOfDices + 2);
  };

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Content>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>Settings</Title>
          </View>
          <Separator />
          <View style={styles.row}>
            <Text style={styles.label}>Dice Type</Text>
            <View style={styles.diceTypeContainer}>
              <View style={styles.diceRow}>
                {DiceTypes.map((dT, i) => (
                  <View key={dT} style={styles.diceWrapper}>
                    <Dice
                      title={"5"}
                      isSelected={diceType === dT}
                      onPress={() => SetDiceType(dT)}
                      isCompact
                      diceType={dT}
                    />
                    {i !== DiceTypes.length - 1 && (
                      <View style={styles.diceSpacer} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Separator />
          <View style={styles.row}>
            <Text style={styles.label}>Sound</Text>
            <View style={styles.segmentedControlContainer}>
              <SegmentedControlTab
                values={["On", "Off"]}
                selectedIndex={soundEnabled ? 0 : 1}
                onTabPress={(i) => SetSoundEnabled(i === 0)}
                borderRadius={12}
                tabStyle={styles.segmentedControlTab}
                tabsContainerStyle={styles.segmentedControlTabsContainer}
                activeTabStyle={styles.segmentedControlActiveTab}
                tabTextStyle={styles.segmentedControlTabText}
              />
            </View>
          </View>
          <Separator />
          <View style={styles.row}>
            <Text style={styles.label}>No. of Dices</Text>
            <View style={styles.stepperContainer}>
              <View style={styles.stepper}>
                <StepperButton icon={"minus"} onPress={decreaseNoOfDices} />
                <Text style={styles.stepperText}>{noOfDices}</Text>
                <StepperButton icon={"plus"} onPress={increaseNoOfDices} />
              </View>
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxWidth: 470,
    width: "85%",
    alignSelf: "center",
    backgroundColor: Colors.Primary,
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
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 21,
    fontFamily: FontNames.MouldyCheese,
  },
  diceTypeContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  diceRow: {
    flexDirection: "row",
  },
  diceWrapper: {
    flexDirection: "row",
  },
  diceSpacer: {
    width: 12,
  },
  segmentedControlContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  segmentedControlTab: {
    borderWidth: 3,
    borderColor: Colors.Highlight,
  },
  segmentedControlTabsContainer: {
    width: 92,
  },
  segmentedControlActiveTab: {
    backgroundColor: Colors.ButtonBG,
  },
  segmentedControlTabText: {
    color: Colors.ButtonBG,
    fontFamily: FontNames.MouldyCheese,
    fontSize: 20,
  },
  stepperContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  stepper: {
    borderWidth: 3,
    borderColor: Colors.Highlight,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    width: 92,
    height: 42,
    alignItems: "center",
    overflow: "hidden",
  },
  stepperText: {
    flex: 1.2,
    textAlign: "center",
    fontFamily: FontNames.MouldyCheese,
    fontSize: 20,
  },
});

export default SettingsModal;
