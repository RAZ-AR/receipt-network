import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Text, StyleSheet, Animated, LayoutChangeEvent } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontFamily, rainbow, s, DOCK_HEIGHT } from "../theme";

export type DockTab = "Home" | "Wallet" | "Scan" | "Rewards" | "Profile";
export type DockScreen = Exclude<DockTab, "Scan">;

// Five items: two tabs, the scan button in the middle, two tabs.
const TABS: { key: DockScreen; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "Home", label: "Početna", icon: "home-outline" },
  { key: "Wallet", label: "Novčanik", icon: "wallet-outline" },
  { key: "Rewards", label: "Nagrade", icon: "gift-outline" },
  { key: "Profile", label: "Profil", icon: "person-outline" },
];

const SCAN_SLOT = s(84);

export function Dock({
  active,
  onNavigate,
}: {
  active: DockScreen;
  onNavigate: (tab: DockTab) => void;
}) {
  const insets = useSafeAreaInsets();
  const [rowWidth, setRowWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;

  const tabWidth = rowWidth > 0 ? (rowWidth - SCAN_SLOT) / TABS.length : 0;
  const index = TABS.findIndex((t) => t.key === active);

  // Tabs 0..1 sit left of the scan slot, 2..3 right of it.
  const pillX = index < 0 ? 0 : index * tabWidth + (index >= 2 ? SCAN_SLOT : 0);

  useEffect(() => {
    if (tabWidth === 0) return;
    Animated.spring(x, {
      toValue: pillX,
      useNativeDriver: true,
      damping: 18,
      stiffness: 140,
      mass: 0.7,
    }).start();
  }, [pillX, tabWidth, x]);

  const onRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setRowWidth(w);
    // Place the pill without animating on first measure.
    const tw = (w - SCAN_SLOT) / TABS.length;
    x.setValue(index * tw + (index >= 2 ? SCAN_SLOT : 0));
  };

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, s(10)) }]}>
      <BlurView intensity={26} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.row} onLayout={onRowLayout}>
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pill,
              { width: tabWidth, transform: [{ translateX: x }] },
            ]}
          />
        )}

        {TABS.slice(0, 2).map((t) => (
          <Tab
            key={t.key}
            label={t.label}
            icon={t.icon}
            width={tabWidth}
            active={active === t.key}
            onPress={() => onNavigate(t.key)}
          />
        ))}

        <Pressable
          onPress={() => onNavigate("Scan")}
          style={styles.scanSlot}
          accessibilityLabel="Skeniraj račun"
        >
          <View style={styles.scan}>
            <LinearGradient colors={rainbow} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.scanInner}>
              <Ionicons name="scan-outline" size={s(26)} color={colors.ink} />
            </View>
          </View>
        </Pressable>

        {TABS.slice(2).map((t) => (
          <Tab
            key={t.key}
            label={t.label}
            icon={t.icon}
            width={tabWidth}
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
  width,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  width: number;
  active: boolean;
  onPress: () => void;
}) {
  const tint = active ? colors.ink : colors.ink2;
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, width ? { width } : null]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
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
    overflow: "visible",
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
    height: DOCK_HEIGHT,
    borderRadius: 999,
  },
  // Soft "tablet" that slides under the selected tab.
  pill: {
    position: "absolute",
    left: 0,
    top: s(6),
    bottom: s(6),
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#A7B0C6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: { alignItems: "center", justifyContent: "center", gap: s(3) },
  label: { fontFamily: fontFamily.bold, fontSize: s(9.5) },
  scanSlot: { width: SCAN_SLOT, alignItems: "center", justifyContent: "center" },
  scan: {
    width: s(66),
    height: s(66),
    borderRadius: s(33),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -s(24),
    borderWidth: 4,
    borderColor: colors.bg,
    shadowColor: "#B49CD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  scanInner: {
    width: s(52),
    height: s(52),
    borderRadius: s(26),
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
});
