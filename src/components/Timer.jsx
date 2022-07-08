import { View } from "react-native";
import { Text } from "react-native-paper";

const Timer = ({ tHours, tMinutes, tSeconds }) => {
  const formatNumber = (n) => ("0" + n).slice(-2);
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}>
        {formatNumber(tHours)}:{formatNumber(tMinutes)}:{formatNumber(tSeconds)}
      </Text>
    </View>
  );
};

export default Timer;
