import { useEffect, useRef, DependencyList, EffectCallback } from "react";

const useUpdateEffect = (
  effect: EffectCallback,
  dependencies: DependencyList = []
) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
};

export default useUpdateEffect;
