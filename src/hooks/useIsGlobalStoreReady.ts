import { useGlobalStore } from "@/src/common/GlobalStore";

export const useIsGlobalStoreReady = () => useGlobalStore((s) => s.isReady);
