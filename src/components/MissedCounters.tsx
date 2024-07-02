import { View, Text } from "react-native";

import { FontNames } from "../common/Const";

interface IMissedCountersProps {
  missedDices: number;
  missedRolls: number;
}

const MissedCounters: React.FC<IMissedCountersProps> = ({
  missedDices,
  missedRolls,
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 12,
          width: "100%",
          maxWidth: 480,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 22,
            textAlign: "center",
            fontFamily: FontNames.MouldyCheese,
          }}
        >
          {missedDices}
          {"\n"}
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              fontFamily: FontNames.MouldyCheese,
            }}
          >
            Missed Dices
          </Text>
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: 22,
            textAlign: "center",
            fontFamily: FontNames.MouldyCheese,
          }}
        >
          {missedRolls}
          {"\n"}
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              fontFamily: FontNames.MouldyCheese,
            }}
          >
            Missed Rolls
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default MissedCounters;
