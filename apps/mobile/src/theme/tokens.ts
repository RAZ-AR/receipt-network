// Beleg soft-glass design tokens — code form of DESIGN_DIRECTION.md.
// Single source of truth for the Expo app. Light-only for MVP (neumorphism
// lives on a light surface; dark theme is a separate task).

export const colors = {
  // Neumorphic surface
  bg: "#EAEDF5",
  hi: "#FFFFFF", // shadow highlight (top-left)
  lo: "#C3CBDE", // shadow (bottom-right)
  track: "#DDE2EE", // pressed grooves / sliders
  ink: "#3E4557", // primary text
  ink2: "#8A93A8", // secondary text / labels

  // Semantic state colors (after scan)
  ok: { fill: ["#A8E8B4", "#7FD4C0"], chipBg: "#D6F0E4", chipText: "#2E7D5B" },
  warn: { fill: ["#FFD9A8", "#F5BE7E"], chipBg: "#FBEBCF", chipText: "#9A6E1E" },
  err: { fill: ["#F5B8C8", "#E89AB0"], chipBg: "#FADBE2", chipText: "#A24E6C" },
} as const;

// Holographic "unicorn" aura — use behind hero elements ONLY (goal ring,
// result circle, avatar, onboarding orb). Render as a conic/blurred gradient
// (expo-linear-gradient + masking, or an image), never as a page background.
export const auraStops = [
  "#FFC9E2",
  "#FFE4C4",
  "#D6F7DB",
  "#C5E9FF",
  "#DFCFFF",
  "#FFC9E2",
] as const;

// Progress-ring gradient (pink -> lilac -> blue)
export const ringGradient = ["#FF9ECB", "#B99CFF", "#7FD4F5"] as const;

// Pastel fills for reward thumbnails, chips, chart bars
export const pastelFills = {
  pink: ["#FFD3E8", "#D9CBFF"],
  blue: ["#C3ECFF", "#A8E8B4"],
  peach: ["#FFE4C4", "#FFB8A8"],
  lav: ["#DFCFFF", "#C3ECFF"],
} as const;

export const radii = { control: 14, card: 20, pill: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

// Manrope (variable) — bundle via expo-font. Full Serbian latin-ext support.
export const typography = {
  family: "Manrope",
  weights: { regular: "500", bold: "700", heavy: "800" },
  numeric: "tabular-nums", // apply where digits count
  hero: { fontSize: 46, fontWeight: "800", letterSpacing: -1 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
} as const;

// NOTE (RN vs CSS): the neumorphic *double* shadow is not directly expressible
// with RN's single shadow. Approaches to pick during Sprint 1:
//   - `react-native-shadow-2` (two stacked shadows), or
//   - pre-rendered shadow images, or
//   - a lightweight Skia layer.
// Glass surfaces (dock, CTAs) use `expo-blur` (BlurView) + a translucent
// white overlay + hairline border. Gradients use `expo-linear-gradient`.
export const shadow = {
  raised: { light: colors.hi, dark: colors.lo, offset: 7, blur: 16 },
  raisedHero: { light: colors.hi, dark: colors.lo, offset: 10, blur: 22 },
  inset: { note: "emulate with inner-shadow lib or layered gradients" },
} as const;

export const glass = {
  dock: { tint: "rgba(255,255,255,0.42)", blur: 18, border: "rgba(255,255,255,0.75)" },
  cta: { tint: "rgba(255,255,255,0.55)", blur: 12, border: "rgba(255,255,255,0.9)" },
} as const;
