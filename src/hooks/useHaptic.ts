import { useCallback } from "react";

export type HapticPattern = "light" | "medium" | "heavy" | "success" | "error";

export const useHaptic = () => {
  const vibrate = useCallback((pattern: HapticPattern = "light") => {
    // Check if vibration API is supported
    if (!navigator.vibrate) return;

    switch (pattern) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(25);
        break;
      case "heavy":
        navigator.vibrate(50);
        break;
      case "success":
        navigator.vibrate([10, 50, 10]);
        break;
      case "error":
        navigator.vibrate([50, 100, 50]);
        break;
      default:
        navigator.vibrate(10);
    }
  }, []);

  return vibrate;
};
