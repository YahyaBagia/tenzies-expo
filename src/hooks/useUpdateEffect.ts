import { useEffect, useRef, DependencyList, EffectCallback } from "react";

/**
 * useUpdateEffect
 *
 * A custom hook that behaves like useEffect, but **skips** the effect on the initial mount.
 * Useful for running side effects only in response to updates (i.e., when dependencies change),
 * not during the first render.
 *
 * Supports cleanup just like useEffect.
 *
 * @param effect - The side-effect function (can optionally return a cleanup function)
 * @param dependencies - Dependency array that determines when the effect runs
 */
const useUpdateEffect = (
  effect: EffectCallback,
  dependencies: DependencyList = []
) => {
  const isInitialMount = useRef(true); // Tracks if the component has just mounted

  useEffect(() => {
    if (isInitialMount.current) {
      // Skip effect on first render
      isInitialMount.current = false;
      return;
    }

    // Run the effect on updates
    const cleanup = effect();

    // Return cleanup function (if any)
    return cleanup;
  }, dependencies);
};

export default useUpdateEffect;
