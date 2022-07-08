import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Text } from "react-native-paper";

const Timer = forwardRef((props, ref) => {
  const [seconds, setSeconds] = useState(0);

  const timeIntervalRef = useRef();

  const formatTimeString = () => {
    const date = new Date(seconds * 1000);
    const isoString = date.toISOString();
    const result = isoString.slice(14, 19);
    return result;
  };

  const startTimer = () => {
    timeIntervalRef.current = setInterval(() => {
      setSeconds((oldSeconds) => oldSeconds + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timeIntervalRef.current);
  };

  const resetTimer = () => {
    clearInterval(timeIntervalRef.current);
    setSeconds(0);
  };

  useImperativeHandle(ref, () => ({ startTimer, pauseTimer, resetTimer }), []);

  return (
    <Text
      style={{
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
      }}
    >
      {formatTimeString()}
    </Text>
  );
});

export default Timer;
