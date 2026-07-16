import { Dimensions } from "react-native";

// The mockups were drawn for a ~390pt-wide phone (iPhone 14/15). On larger
// devices (16 Pro Max is 440pt) fixed sizes left the screen sparse, so scale
// sizes modestly with the viewport. Clamped: scaling 1:1 with width makes big
// phones look childish, not scaling at all makes them look empty.
const BASE_WIDTH = 390;
const { width, height } = Dimensions.get("window");

const ratio = Math.min(Math.max(width / BASE_WIDTH, 0.9), 1.18);

/** Scale a mockup px value to the current device. */
export const s = (n: number): number => Math.round(n * ratio * 100) / 100;

export const screen = { width, height };

/** Tall phones (16 Pro Max etc.) can afford more breathing room. */
export const isTall = height >= 900;

// Height reserved for the floating dock so scroll content clears it.
export const DOCK_HEIGHT = s(64);
export const DOCK_CLEARANCE = DOCK_HEIGHT + s(28);
