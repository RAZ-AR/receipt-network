// Screen registry — mirrors the approved clickable prototype.
// One component per entry will live under src/screens/<Name>Screen.tsx.
// Tabs are the dock; the rest are pushed/stacked.

export const TAB_SCREENS = [
  "Home",
  "Wallet",
  "Rewards",
  "History",
  "Profile",
] as const;

export const STACK_SCREENS = [
  "Onboarding",
  "Auth",
  "Scanner",
  "Result", // + states: QrUnreadable, Invalid, TooOld, Duplicate
  "Review",
  "RewardDetails",
  "Redemption",
  "Lottery",
  "Notifications",
  "BatchScan",
] as const;

export type TabScreen = (typeof TAB_SCREENS)[number];
export type StackScreen = (typeof STACK_SCREENS)[number];
