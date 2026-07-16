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

export function RewardsScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  const [tab, setTab] = useState<"catalog" | "soon">("catalog");
  const starred = CATALOG.filter((r) => r.starred).length;

  return (
    <ScreenLayout
      title="Nagrade"
      headerRight={
        <View style={styles.pill}>
          <Text style={styles.pillText}>{tab === "catalog" ? "1 240 p" : "🎁"}</Text>
        </View>
      }
      active="Rewards"
      onNavigate={onNavigate}
    >
      <Segmented<"catalog" | "soon">
        options={[
          { key: "catalog", label: "Katalog" },
          { key: "soon", label: "Uskoro" },
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
        <View style={styles.soon}>
          <View style={styles.soonOrb}>
            <Aura size={s(150)} />
            <Ionicons name="gift" size={s(46)} color="#8B6FC0" />
          </View>
          <Text style={styles.soonTitle}>Uskoro — iznenađenje</Text>
          <Text style={styles.soonText}>
            Spremamo nešto posebno za tvoje skenirane račune. Nastavi da skupljaš poene — biće ti od koristi.
          </Text>
        </View>
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
  soon: { alignItems: "center", justifyContent: "center", paddingTop: s(40), paddingHorizontal: s(20) },
  soonOrb: { width: s(150), height: s(150), alignItems: "center", justifyContent: "center", marginBottom: s(22) },
  soonTitle: { fontFamily: fontFamily.heavy, fontSize: s(20), color: colors.ink, marginBottom: s(10) },
  soonText: {
    fontFamily: fontFamily.regular,
    fontSize: s(13.5),
    color: colors.ink2,
    textAlign: "center",
    lineHeight: s(21),
    maxWidth: s(290),
  },
});
