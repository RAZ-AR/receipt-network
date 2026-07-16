import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { ProgressRing } from "../components/ProgressRing";
import { Dock, DockTab } from "../components/Dock";
import { colors, fontFamily } from "../theme";
import { MAX_ACTIVE_GOALS } from "@beleg/shared-types";

const GOALS = [
  { name: "Besplatna kafa", detail: "još 18 poena · Kaf. Central", pct: 0.82 },
  { name: "−15% Maxi", detail: "još 178 poena · vaučer", pct: 0.41 },
  { name: "Croissant", detail: "još 125 poena · Trocadero", pct: 0.5 },
].slice(0, MAX_ACTIVE_GOALS);

export function HomeScreen({ onNavigate }: { onNavigate: (tab: DockTab) => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>Dobro veče, Marko</Text>
            <Text style={styles.city}>Beograd · 16. jul</Text>
          </View>
          <NeoSurface radius={22} style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </NeoSurface>
        </View>

        <Text style={styles.section}>Moji ciljevi · {GOALS.length}/{MAX_ACTIVE_GOALS}</Text>
        {GOALS.map((g) => (
          <NeoSurface key={g.name} radius={18} style={styles.goalCard}>
            <View style={styles.ringSmall}>
              <ProgressRing size={48} stroke={5} progress={g.pct} />
              <Text style={styles.ringPct}>{Math.round(g.pct * 100)}%</Text>
            </View>
            <View style={styles.goalMid}>
              <Text style={styles.goalName}>{g.name}</Text>
              <Text style={styles.goalDetail}>{g.detail}</Text>
            </View>
          </NeoSurface>
        ))}

        <Text style={styles.section}>Srećke i danas</Text>
        <NeoSurface radius={18} style={styles.goalCard}>
          <View style={styles.ringSmall}>
            <Aura size={48} />
          </View>
          <View style={styles.goalMid}>
            <Text style={styles.goalName}>7 srećaka</Text>
            <Text style={styles.goalDetail}>izvlačenje za 15 dana</Text>
          </View>
        </NeoSurface>
      </ScrollView>

      <Dock active="Home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  name: { fontFamily: fontFamily.heavy, fontSize: 20, color: colors.ink },
  city: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.ink2, marginTop: 2 },
  avatar: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontFamily.heavy, fontSize: 14, color: colors.ink },
  section: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.ink2,
    marginTop: 6,
    marginBottom: 9,
  },
  goalCard: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 10, gap: 12 },
  ringSmall: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  ringPct: { position: "absolute", fontFamily: fontFamily.heavy, fontSize: 11, color: colors.ink },
  goalMid: { flex: 1 },
  goalName: { fontFamily: fontFamily.heavy, fontSize: 14, color: colors.ink },
  goalDetail: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.ink2, marginTop: 2 },
});
