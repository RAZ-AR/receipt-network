// Theme surface for components. Re-exports the design tokens and adds a couple
// of RN-specific helpers derived from them.
export * from "./tokens";
import { colors } from "./tokens";

// Single-shadow approximation of the neumorphic raised look.
// The mockups use a *double* shadow (light top-left + dark bottom-right) which
// RN can't express on one View — for the real double effect, wrap with
// `react-native-shadow-2`. This is the pragmatic default.
export const raisedShadow = {
  shadowColor: colors.lo,
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 0.6,
  shadowRadius: 12,
  elevation: 6, // Android
} as const;

export const fontFamily = {
  regular: "Manrope_500Medium",
  bold: "Manrope_700Bold",
  heavy: "Manrope_800ExtraBold",
} as const;
