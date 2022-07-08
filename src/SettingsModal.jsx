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
  SetDiceType,
  SetSoundEnabled,
} from "./common/GlobalState";

const SettingsModal = ({ isVisible, onDismiss }) => {
  const [diceType] = useGlobalState("diceType");
  const [soundEnabled] = useGlobalState("soundEnabled");

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
        <Dialog.Content>
          <Divider />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
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
                {i !== DiceTypes.length - 1 && <View style={{ width: 12 }} key={`${i}`} />}
              </>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
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
                tabsContainerStyle={{ width: 112 }}
                activeTabStyle={{ backgroundColor: Colors.ButtonBG }}
                tabTextStyle={{
                  color: Colors.ButtonBG,
                  fontWeight: "bold",
                  fontSize: 26,
                }}
              />
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default SettingsModal;
