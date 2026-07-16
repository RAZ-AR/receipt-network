import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontFamily, rainbow, s, DOCK_HEIGHT } from "../theme";

export type DockTab = "Home" | "Wallet" | "Scan" | "Rewards" | "History" | "Profile";
export type DockScreen = Exclude<DockTab, "Scan">;

const TABS: { key: DockScreen; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "Home", label: "Početna", icon: "home-outline" },
  { key: "Wallet", label: "Novčanik", icon: "wallet-outline" },
  { key: "Rewards", label: "Nagrade", icon: "gift-outline" },
  { key: "History", label: "Istorija", icon: "receipt-outline" },
  { key: "Profile", label: "Profil", icon: "person-outline" },
];

/**
 * Liquid-glass dock: floating blurred pill, icon above label, with the scan
 * button raised in the middle. Sits above the home indicator via safe-area
 * insets and is present on every main screen.
 */
export function Dock({
  active,
  onNavigate,
}: {
  active: DockScreen;
  onNavigate: (tab: DockTab) => void;
}) {
  const insets = useSafeAreaInsets();
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, s(10)) }]}>
      <BlurView intensity={26} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.row}>
        {left.map((t) => (
          <Tab
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={active === t.key}
            onPress={() => onNavigate(t.key)}
          />
        ))}

        <Pressable onPress={() => onNavigate("Scan")} style={styles.scanWrap} accessibilityLabel="Skeniraj račun">
          <View style={styles.scan}>
            <LinearGradient colors={rainbow} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.scanInner}>
              <Ionicons name="scan-outline" size={s(22)} color={colors.ink} />
            </View>
          </View>
        </Pressable>

        {right.map((t) => (
          <Tab
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={active === t.key}
            onPress={() => onNavigate(t.key)}
          />
        ))}
      </View>
    </View>
  );
}

function Tab({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  const tint = active ? colors.ink : colors.ink2;
  return (
    <Pressable onPress={onPress} style={styles.tab} accessibilityLabel={label}>
      <Ionicons name={icon} size={s(20)} color={tint} />
      <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: s(12),
    right: s(12),
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(255,255,255,0.5)",
    shadowColor: "#8A93A8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: DOCK_HEIGHT,
    paddingHorizontal: s(6),
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: s(3) },
  label: { fontFamily: fontFamily.bold, fontSize: s(9.5) },
  scanWrap: { width: s(58), alignItems: "center", justifyContent: "center" },
  scan: {
    width: s(52),
    height: s(52),
    borderRadius: s(26),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -s(18),
    borderWidth: 3,
    borderColor: colors.bg,
    shadowColor: "#B49CD8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  scanInner: {
    width: s(42),
    height: s(42),
    borderRadius: s(21),
    backgroundColor: "rgba(255,255,255,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
});
