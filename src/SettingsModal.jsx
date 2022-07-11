import { View } from "react-native";
import {
  Dialog,
  Divider,
  IconButton,
  Portal,
  Text,
  Title,
} from "react-native-paper";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Dice from "./components/Dice";

import { Colors } from "./common/Const";
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
            Settings
          </Title>
        </Dialog.Actions>
        <Divider style={{ marginBottom: 12 }} />
        <Dialog.Content>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ flex: 1, fontSize: 21, fontWeight: "bold" }}>
              Dice Type
            </Text>
            {DiceTypes.map((dT, i) => (
              <>
                <Dice
                  title={"5"}
                  isSelected={diceType === dT}
                  onPress={() => SetDiceType(dT)}
                  isCompact
                  diceType={dT}
                  key={dT}
                />
                {i !== DiceTypes.length - 1 && (
                  <View style={{ width: 12 }} key={`${i}`} />
                )}
              </>
            ))}
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 21, fontWeight: "bold" }}>Sound</Text>
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
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 21, fontWeight: "bold" }}>
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
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "bold",
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
      color={Colors.Highlight}
    />
  </View>
);
