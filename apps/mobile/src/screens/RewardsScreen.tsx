import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { Segmented } from "../components/Segmented";
import { ScreenLayout } from "../components/ScreenLayout";
import type { DockTab } from "../components/Dock";
import { colors, fontFamily, s, GradientColors } from "../theme";
import { MAX_ACTIVE_GOALS } from "@beleg/shared-types";

const CATALOG: { name: string; vendor: string; cost: string; g: GradientColors; starred: boolean }[] = [
  { name: "Besplatna kafa", vendor: "Kaf. Central", cost: "100 p", g: ["#FFD3E8", "#D9CBFF"], starred: true },
  { name: "−15% Maxi", vendor: "Vaučer", cost: "300 p", g: ["#C3ECFF", "#A8E8B4"], starred: true },
  { name: "Croissant", vendor: "Trocadero", cost: "250 p", g: ["#FFE4C4", "#FFB8A8"], starred: true },
  { name: "Bioskop", vendor: "Cineplexx", cost: "800 p", g: ["#DFCFFF", "#C3ECFF"], starred: false },
];

const TICKETS = ["BG2200777", "BG2200781", "BG2200794", "BG2200803", "BG2200818", "BG2200826"];

export function RewardsScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  const [tab, setTab] = useState<"catalog" | "lottery">("catalog");
  const starred = CATALOG.filter((r) => r.starred).length;

  return (
    <ScreenLayout
      title="Nagrade"
      headerRight={
        <View style={styles.pill}>
          <Text style={styles.pillText}>{tab === "catalog" ? "1 240 p" : "jul 2026"}</Text>
        </View>
      }
      active="Rewards"
      onNavigate={onNavigate}
    >
      <Segmented<"catalog" | "lottery">
        options={[
          { key: "catalog", label: "Katalog" },
          { key: "lottery", label: "Srećke" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "catalog" ? (
        <>
          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={s(15)} color={colors.ink} />
            <Text style={styles.filterText}>Filteri</Text>
          </Pressable>
          <View style={styles.grid}>
            {CATALOG.map((r) => (
              <NeoSurface key={r.name} radius={s(18)} style={styles.rcard}>
                <View style={[styles.star, r.starred && styles.starOn]}>
                  <Ionicons name={r.starred ? "star" : "star-outline"} size={s(13)} color={r.starred ? "#fff" : colors.ink2} />
                </View>
                <LinearGradient colors={r.g} style={styles.thumb} />
                <Text style={styles.rname}>{r.name}</Text>
                <Text style={styles.rvendor}>{r.vendor}</Text>
                <View style={styles.rcost}>
                  <Text style={styles.rprice}>{r.cost}</Text>
                  <Text style={styles.rgoal}>{r.starred ? "cilj ✓" : `${starred}/${MAX_ACTIVE_GOALS}`}</Text>
                </View>
              </NeoSurface>
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.countWrap}>
            <Aura size={s(128)} />
            <Text style={styles.countNum}>7</Text>
            <Text style={styles.countUnit}>srećaka ovog meseca</Text>
          </View>
          <NeoSurface radius={s(14)} style={styles.periodNote}>
            <Text style={styles.periodText}>
              Učestvuju samo srećke iz jula. Posle izvlačenja (31.7) se ne prenose.
            </Text>
          </NeoSurface>
          <Text style={styles.numLabel}>Tvoji brojevi</Text>
          <View style={styles.numGrid}>
            {TICKETS.map((n) => (
              <NeoSurface key={n} radius={s(13)} style={styles.numChip}>
                <Text style={styles.numText}>{n}</Text>
              </NeoSurface>
            ))}
          </View>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 999, paddingHorizontal: s(11), paddingVertical: s(5), backgroundColor: "#E7DCF7" },
  pillText: { fontFamily: fontFamily.heavy, fontSize: s(10.5), color: "#5A4470" },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: s(7), alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: s(13), paddingVertical: s(8), backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.track, marginBottom: s(13) },
  filterText: { fontFamily: fontFamily.heavy, fontSize: s(12), color: colors.ink },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: s(12) },
  rcard: { width: "47%", padding: s(11) },
  star: { position: "absolute", top: s(8), right: s(8), width: s(28), height: s(28), borderRadius: s(14), backgroundColor: "rgba(255,255,255,0.7)", alignItems: "center", justifyContent: "center", zIndex: 2, borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" },
  starOn: { backgroundColor: "#F5B94E" },
  thumb: { height: s(62), borderRadius: s(12), marginBottom: s(9) },
  rname: { fontFamily: fontFamily.heavy, fontSize: s(12.5), color: colors.ink },
  rvendor: { fontFamily: fontFamily.bold, fontSize: s(10), color: colors.ink2, marginBottom: s(8) },
  rcost: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rprice: { fontFamily: fontFamily.heavy, fontSize: s(13.5), color: colors.ink },
  rgoal: { fontFamily: fontFamily.bold, fontSize: s(10), color: "#3E7D68" },
  countWrap: { alignItems: "center", justifyContent: "center", paddingVertical: s(14), marginBottom: s(6) },
  countNum: { fontFamily: fontFamily.heavy, fontSize: s(56), color: colors.ink, letterSpacing: -1.5 },
  countUnit: { fontFamily: fontFamily.bold, fontSize: s(11.5), letterSpacing: 0.5, textTransform: "uppercase", color: colors.ink2 },
  periodNote: { padding: s(12), marginBottom: s(14) },
  periodText: { fontFamily: fontFamily.regular, fontSize: s(11.5), color: colors.ink2, lineHeight: s(17) },
  numLabel: { fontFamily: fontFamily.bold, fontSize: s(10), letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginBottom: s(8) },
  numGrid: { flexDirection: "row", flexWrap: "wrap", gap: s(8) },
  numChip: { width: "47%", paddingVertical: s(11), paddingHorizontal: s(12) },
  numText: { fontFamily: fontFamily.heavy, fontSize: s(12), color: colors.ink, letterSpacing: 0.5 },
});
