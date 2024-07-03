import { useRef } from "react";
import { useWindowDimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

type ConfettiCannonRef = React.ElementRef<typeof ConfettiCannon>;

interface IConfettiShowerProps {
  visible: boolean;
}

const ConfettiShower: React.FC<IConfettiShowerProps> = ({ visible }) => {
  const leftConfettiRef = useRef<ConfettiCannonRef>(null);
  const rightConfettiRef = useRef<ConfettiCannonRef>(null);

  const { width: windowWidth } = useWindowDimensions();

  const startConfettis = () => {
    leftConfettiRef.current?.start();
    rightConfettiRef.current?.start();
  };

  if (!visible) return null;
  return (
    <>
      <ConfettiCannon
        count={50}
        origin={{ x: 100, y: 100 }}
        autoStart={true}
        ref={leftConfettiRef}
        onAnimationEnd={startConfettis}
        fadeOut={true}
      />
      <ConfettiCannon
        count={50}
        origin={{ x: windowWidth - 100, y: 100 }}
        autoStart={true}
        ref={rightConfettiRef}
        onAnimationEnd={startConfettis}
        fadeOut={true}
      />
    </>
  );
};

export default ConfettiShower;
