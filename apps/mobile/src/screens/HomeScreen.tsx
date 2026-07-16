import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NeoSurface } from "../components/NeoSurface";
import { ProgressRing } from "../components/ProgressRing";
import { ScreenLayout } from "../components/ScreenLayout";
import type { DockTab } from "../components/Dock";
import { colors, fontFamily, s, GradientColors } from "../theme";
import { MAX_ACTIVE_GOALS } from "@beleg/shared-types";

const GOALS = [
  { name: "Besplatna kafa", detail: "još 18 poena · Kaf. Central", pct: 0.82 },
  { name: "−15% Maxi", detail: "još 178 poena · vaučer", pct: 0.41 },
  { name: "Croissant", detail: "još 125 poena · Trocadero", pct: 0.5 },
].slice(0, MAX_ACTIVE_GOALS);

const WEEK: { h: number; g: GradientColors }[] = [
  { h: 0.4, g: ["#FFC9E2", "#FFA8CE"] },
  { h: 0.26, g: ["#FFE4C4", "#FFC998"] },
  { h: 0.58, g: ["#D6F7DB", "#A8E8B4"] },
  { h: 0.34, g: ["#C5E9FF", "#93D3FA"] },
  { h: 0.5, g: ["#DFCFFF", "#C0A6F5"] },
  { h: 1, g: ["#FFC9E2", "#F58BBB"] },
  { h: 0.44, g: ["#C5E9FF", "#7EC4F0"] },
];

export function HomeScreen({ onNavigate }: { onNavigate: (tab: DockTab) => void }) {
  return (
    <ScreenLayout active="Home" onNavigate={onNavigate}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>Dobro veče, Marko</Text>
          <Text style={styles.city}>Beograd · 16. jul</Text>
        </View>
        <NeoSurface radius={s(22)} style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </NeoSurface>
      </View>

      <Text style={styles.section}>
        Moji ciljevi · {GOALS.length}/{MAX_ACTIVE_GOALS}
      </Text>
      {GOALS.map((g) => (
        <NeoSurface key={g.name} radius={s(18)} style={styles.goalCard}>
          <View style={styles.ringSmall}>
            <ProgressRing size={s(46)} stroke={s(5)} progress={g.pct} />
            <Text style={styles.ringPct}>{Math.round(g.pct * 100)}%</Text>
          </View>
          <View style={styles.goalMid}>
            <Text style={styles.goalName}>{g.name}</Text>
            <Text style={styles.goalDetail}>{g.detail}</Text>
          </View>
          <Ionicons name="star" size={s(16)} color="#F5B94E" />
        </NeoSurface>
      ))}

      <Text style={styles.section}>Srećke i danas</Text>
      <View style={styles.duo}>
        <NeoSurface radius={s(18)} style={styles.duoCard}>
          <Text style={styles.duoLabel}>Srećke</Text>
          <Text style={styles.duoValue}>7</Text>
          <Text style={styles.duoSub}>izvlačenje za 15 dana</Text>
        </NeoSurface>
        <NeoSurface radius={s(18)} style={styles.duoCard}>
          <Text style={styles.duoLabel}>Danas</Text>
          <Text style={styles.duoValue}>2×</Text>
          <Text style={styles.duoSub}>poeni kod Maxi</Text>
        </NeoSurface>
      </View>

      <NeoSurface radius={s(18)} style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.duoLabel}>Nedelja</Text>
          <Text style={styles.infoValue}>12 računa</Text>
        </View>
        <View style={styles.bars}>
          {WEEK.map((b, i) => (
            <LinearGradient
              key={i}
              colors={b.g}
              style={[styles.bar, { height: s(64) * b.h }]}
            />
          ))}
        </View>
        <Text style={styles.fact}>
          Najčešće skeniraš u <Text style={styles.factStrong}>Kafeteriji Central</Text> — još 2 skena i ulaziš u top 10% Beograda.
        </Text>
      </NeoSurface>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: s(18) },
  name: { fontFamily: fontFamily.heavy, fontSize: s(22), color: colors.ink, letterSpacing: -0.4 },
  city: { fontFamily: fontFamily.bold, fontSize: s(12), color: colors.ink2, marginTop: s(2) },
  avatar: { width: s(44), height: s(44), alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontFamily.heavy, fontSize: s(14), color: colors.ink },
  section: {
    fontFamily: fontFamily.bold,
    fontSize: s(10),
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.ink2,
    marginTop: s(8),
    marginBottom: s(9),
  },
  goalCard: { flexDirection: "row", alignItems: "center", padding: s(12), marginBottom: s(10), gap: s(12) },
  ringSmall: { width: s(46), height: s(46), alignItems: "center", justifyContent: "center" },
  ringPct: { position: "absolute", fontFamily: fontFamily.heavy, fontSize: s(11), color: colors.ink },
  goalMid: { flex: 1 },
  goalName: { fontFamily: fontFamily.heavy, fontSize: s(14), color: colors.ink },
  goalDetail: { fontFamily: fontFamily.bold, fontSize: s(11), color: colors.ink2, marginTop: s(2) },
  duo: { flexDirection: "row", gap: s(11), marginBottom: s(11) },
  duoCard: { flex: 1, padding: s(13) },
  duoLabel: {
    fontFamily: fontFamily.bold,
    fontSize: s(10),
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.ink2,
  },
  duoValue: { fontFamily: fontFamily.heavy, fontSize: s(24), color: colors.ink, marginTop: s(5) },
  duoSub: { fontFamily: fontFamily.bold, fontSize: s(10.5), color: colors.ink2, marginTop: s(2) },
  info: { padding: s(14) },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: s(10) },
  infoValue: { fontFamily: fontFamily.heavy, fontSize: s(12.5), color: colors.ink },
  bars: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: s(64) },
  bar: { width: s(16), borderRadius: s(8) },
  fact: { fontFamily: fontFamily.bold, fontSize: s(11.5), color: colors.ink2, lineHeight: s(18), marginTop: s(11) },
  factStrong: { color: colors.ink },
});
