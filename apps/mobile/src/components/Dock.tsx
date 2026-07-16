import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fontFamily } from "../theme";

export type DockTab = "Home" | "Wallet" | "Scan" | "Rewards" | "Profile";

/**
 * Liquid-glass bottom dock with a rainbow scan button in the middle.
 * Icons are text placeholders here — swap for an icon set (e.g.
 * @expo/vector-icons) during Sprint 1 polish.
 */
export function Dock({
  active,
  onNavigate,
}: {
  active: Exclude<DockTab, "Scan">;
  onNavigate: (tab: DockTab) => void;
}) {
  const tabs: Exclude<DockTab, "Scan">[] = ["Home", "Wallet", "Rewards", "Profile"];
  return (
    <View style={styles.wrap}>
      <BlurView intensity={18} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.row}>
        {tabs.slice(0, 2).map((t) => (
          <DockBtn key={t} label={t} active={active === t} onPress={() => onNavigate(t)} />
        ))}
        <Pressable onPress={() => onNavigate("Scan")} style={styles.scan}>
          <LinearGradient
            colors={["#FFC9E2", "#FFE4C4", "#D6F7DB", "#C5E9FF", "#DFCFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.scanInner} />
        </Pressable>
        {tabs.slice(2).map((t) => (
          <DockBtn key={t} label={t} active={active === t} onPress={() => onNavigate(t)} />
        ))}
      </View>
    </View>
  );
}

function DockBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={[styles.btnLabel, active && styles.btnLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "rgba(255,255,255,0.42)",
  },
  row: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", padding: 9 },
  btn: { paddingHorizontal: 10, paddingVertical: 8 },
  btnLabel: { fontFamily: fontFamily.bold, fontSize: 9, color: colors.ink2 },
  btnLabelActive: { color: colors.ink },
  scan: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  scanInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.72)" },
});
