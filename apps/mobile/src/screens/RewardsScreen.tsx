import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { Dock, DockTab } from "../components/Dock";
import { colors, fontFamily } from "../theme";
import { MAX_ACTIVE_GOALS } from "@beleg/shared-types";

const CATALOG = [
  { name: "Besplatna kafa", vendor: "Kaf. Central", cost: "100 p", g: ["#FFD3E8", "#D9CBFF"], starred: true },
  { name: "−15% Maxi", vendor: "Vaučer", cost: "300 p", g: ["#C3ECFF", "#A8E8B4"], starred: true },
  { name: "Croissant", vendor: "Trocadero", cost: "250 p", g: ["#FFE4C4", "#FFB8A8"], starred: true },
  { name: "Bioskop", vendor: "Cineplexx", cost: "800 p", g: ["#DFCFFF", "#C3ECFF"], starred: false },
];

const TICKETS = ["BG2200777", "BG2200781", "BG2200794", "BG2200803", "BG2200818", "BG2200826"];

export function RewardsScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  const [tab, setTab] = useState<"catalog" | "lottery">("catalog");
  const starredCount = CATALOG.filter((r) => r.starred).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Nagrade</Text>
        <View style={styles.pill}><Text style={styles.pillText}>{tab === "catalog" ? "1 240 p" : "jul 2026"}</Text></View>
      </View>

      <View style={styles.seg}>
        <SegBtn label="Katalog" active={tab === "catalog"} onPress={() => setTab("catalog")} />
        <SegBtn label="Srećke" active={tab === "lottery"} onPress={() => setTab("lottery")} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {tab === "catalog" ? (
          <>
            <Pressable style={styles.filterBtn}>
              <Text style={styles.filterText}>Filteri</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
            </Pressable>
            <View style={styles.grid}>
              {CATALOG.map((r) => (
                <NeoSurface key={r.name} radius={18} style={styles.rcard}>
                  <View>
                    <View style={[styles.star, r.starred && styles.starOn]}>
                      <Text style={[styles.starIcon, r.starred && styles.starIconOn]}>★</Text>
                    </View>
                    <LinearGradient colors={r.g} style={styles.thumb} />
                    <Text style={styles.rname}>{r.name}</Text>
                    <Text style={styles.rvendor}>{r.vendor}</Text>
                    <View style={styles.rcost}>
                      <Text style={styles.rprice}>{r.cost}</Text>
                      <Text style={styles.rgoal}>
                        {r.starred ? "cilj ✓" : `${starredCount}/${MAX_ACTIVE_GOALS}`}
                      </Text>
                    </View>
                  </View>
                </NeoSurface>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.countWrap}>
              <Aura size={130} style={{ top: -4 }} />
              <Text style={styles.countNum}>7</Text>
              <Text style={styles.countUnit}>srećaka ovog meseca</Text>
            </View>
            <NeoSurface radius={14} style={styles.periodNote}>
              <Text style={styles.periodText}>
                Učestvuju samo srećke iz jula. Posle izvlačenja (31.7) se ne prenose.
              </Text>
            </NeoSurface>
            <Text style={styles.numLabel}>Tvoji brojevi</Text>
            <View style={styles.numGrid}>
              {TICKETS.map((n) => (
                <NeoSurface key={n} radius={13} style={styles.numChip}>
                  <Text style={styles.numText}>{n}</Text>
                </NeoSurface>
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <Dock active="Rewards" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function SegBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segBtn, active && styles.segBtnOn]}>
      <Text style={[styles.segText, active && styles.segTextOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginBottom: 12 },
  title: { fontFamily: fontFamily.heavy, fontSize: 18, color: colors.ink },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#E7DCF7" },
  pillText: { fontFamily: fontFamily.heavy, fontSize: 10.5, color: "#5A4470" },
  seg: { flexDirection: "row", backgroundColor: colors.bg, borderRadius: 14, padding: 4, marginBottom: 13, borderWidth: 1, borderColor: colors.track },
  segBtn: { flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 11 },
  segBtnOn: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.track },
  segText: { fontFamily: fontFamily.heavy, fontSize: 12.5, color: colors.ink2 },
  segTextOn: { color: colors.ink },
  body: { paddingBottom: 100 },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 13, paddingVertical: 7, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.track, marginBottom: 13 },
  filterText: { fontFamily: fontFamily.heavy, fontSize: 12, color: colors.ink },
  badge: { minWidth: 17, height: 17, borderRadius: 999, backgroundColor: "#B99CFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { color: "#fff", fontSize: 10, fontFamily: fontFamily.heavy },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  rcard: { width: "47%", padding: 11 },
  star: { position: "absolute", top: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center", zIndex: 2, borderWidth: 1, borderColor: "rgba(255,255,255,0.8)" },
  starOn: { backgroundColor: "#F5B94E" },
  starIcon: { fontSize: 13, color: colors.ink2 },
  starIconOn: { color: "#fff" },
  thumb: { height: 60, borderRadius: 12, marginBottom: 8 },
  rname: { fontFamily: fontFamily.heavy, fontSize: 12, color: colors.ink },
  rvendor: { fontFamily: fontFamily.bold, fontSize: 10, color: colors.ink2, marginBottom: 8 },
  rcost: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rprice: { fontFamily: fontFamily.heavy, fontSize: 13.5, color: colors.ink },
  rgoal: { fontFamily: fontFamily.bold, fontSize: 10, color: "#3E7D68" },
  countWrap: { alignItems: "center", justifyContent: "center", paddingVertical: 12, marginBottom: 4 },
  countNum: { fontFamily: fontFamily.heavy, fontSize: 56, color: colors.ink },
  countUnit: { fontFamily: fontFamily.bold, fontSize: 11.5, letterSpacing: 0.5, textTransform: "uppercase", color: colors.ink2 },
  periodNote: { padding: 12, marginBottom: 14 },
  periodText: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.ink2, lineHeight: 17 },
  numLabel: { fontFamily: fontFamily.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginBottom: 8 },
  numGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  numChip: { width: "47%", paddingVertical: 10, paddingHorizontal: 12 },
  numText: { fontFamily: fontFamily.heavy, fontSize: 12, color: colors.ink, letterSpacing: 0.5 },
});
