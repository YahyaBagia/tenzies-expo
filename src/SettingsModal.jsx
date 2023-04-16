import { View } from "react-native";
import { Dialog, IconButton, Portal, Text, Title } from "react-native-paper";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Dice from "./components/Dice";
import Separator from "./components/Separator";

import { Colors, FontNames } from "./common/Const";
import {
  DiceTypes,
  useGlobalState,
  SetNoOfDices,
  SetDiceType,
  SetSoundEnabled,
} from "./common/GlobalState";

const SettingsModal = ({ isVisible, onDismiss }) => {
  const [noOfDices] = useGlobalState("noOfDices");
  const [diceType] = useGlobalState("diceType");
  const [soundEnabled] = useGlobalState("soundEnabled");

  const decreaseNoOfDices = () => {
    if (noOfDices > 4) {
      SetNoOfDices(noOfDices - 2);
    }
  };

  const increaseNoOfDices = () => {
    if (noOfDices < 12) {
      SetNoOfDices(noOfDices + 2);
    }
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
          backgroundColor: Colors.Primary,
        }}
      >
        <Dialog.Content>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Title
              style={{
                flex: 1,
                fontSize: 26,
                fontFamily: FontNames.MouldyCheese,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Settings
            </Title>
          </View>
          <Separator />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 21,
                fontFamily: FontNames.MouldyCheese,
              }}
            >
              Dice Type
            </Text>
            {DiceTypes.map((dT, i) => (
              <View key={dT} style={{ flexDirection: "row" }}>
                <Dice
                  title={"5"}
                  isSelected={diceType === dT}
                  onPress={() => SetDiceType(dT)}
                  isCompact
                  diceType={dT}
                />
                {i !== DiceTypes.length - 1 && <View style={{ width: 12 }} />}
              </View>
            ))}
          </View>
          <Separator />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 21, fontFamily: FontNames.MouldyCheese }}>
              Sound
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <SegmentedControlTab
                values={["On", "Off"]}
                selectedIndex={soundEnabled ? 0 : 1}
                onTabPress={(i) => SetSoundEnabled(i === 0)}
                borderRadius={12}
                tabStyle={{ borderWidth: 3, borderColor: Colors.Highlight }}
                tabsContainerStyle={{ width: 92 }}
                activeTabStyle={{ backgroundColor: Colors.ButtonBG }}
                tabTextStyle={{
                  color: Colors.ButtonBG,
                  fontFamily: FontNames.MouldyCheese,
                  fontSize: 20,
                }}
              />
            </View>
          </View>
          <Separator />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 21, fontFamily: FontNames.MouldyCheese }}>
              No. of Dices
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <View
                style={{
                  borderWidth: 3,
                  borderColor: Colors.Highlight,
                  borderRadius: 12,
                  backgroundColor: "white",
                  flexDirection: "row",
                  width: 92,
                  height: 42,
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <StepperButton icon={"minus"} onPress={decreaseNoOfDices} />
                <Text
                  style={{
                    flex: 1.1,
                    textAlign: "center",
                    fontFamily: FontNames.MouldyCheese,
                    fontSize: 20,
                  }}
                >
                  {noOfDices}
                </Text>
                <StepperButton icon={"plus"} onPress={increaseNoOfDices} />
              </View>
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default SettingsModal;

const StepperButton = ({ icon, onPress }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: Colors.ButtonBG,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  >
    <IconButton
      icon={icon}
      size={28}
      onPress={onPress}
      style={{ margin: 0 }}
      iconColor={Colors.Highlight}
    />
  </View>
);
