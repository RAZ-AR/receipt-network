import React, { ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dock, DockTab, DockScreen } from "./Dock";
import { colors, fontFamily, s, DOCK_CLEARANCE } from "../theme";

/**
 * Shared shell for every main screen: safe-area, optional big title, scrolling
 * body that clears the floating dock, and the dock itself. Screens use this so
 * the dock is guaranteed present and consistent everywhere.
 */
export function ScreenLayout({
  title,
  headerRight,
  active,
  onNavigate,
  children,
  scroll = true,
}: {
  title?: string;
  headerRight?: ReactNode;
  active: DockScreen;
  onNavigate: (tab: DockTab) => void;
  children: ReactNode;
  scroll?: boolean;
}) {
  const body = (
    <>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {headerRight}
        </View>
      ) : null}
      {children}
    </>
  );

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={styles.content}>{body}</View>
      )}
      <Dock active={active} onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: s(18), paddingTop: s(6), paddingBottom: DOCK_CLEARANCE },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: s(14),
  },
  title: { fontFamily: fontFamily.heavy, fontSize: s(26), color: colors.ink, letterSpacing: -0.5 },
});
