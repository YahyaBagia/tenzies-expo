import { StyleSheet } from "react-native";
import { Divider } from "react-native-paper";

const Separator: React.FC = () => <Divider style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    marginVertical: 12,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
});

export default Separator;
