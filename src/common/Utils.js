import { Platform } from "react-native";

export default class Utils {
  static SplitArray = (flatArray, numCols) => {
    const newArray = [];
    for (let c = 0; c < numCols; c++) {
      newArray.push([]);
    }
    for (let i = 0; i < flatArray.length; i++) {
      const mod = i % numCols;
      newArray[mod].push(flatArray[i]);
    }
    return newArray;
  };

  static IsOnWeb = () => Platform.OS === "web";
}
