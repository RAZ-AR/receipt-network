import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NeoSurface } from "../components/NeoSurface";
import { Dock, DockTab } from "../components/Dock";
import { colors, fontFamily, GradientColors } from "../theme";

const ROWS: { name: string; when: string; status: string; ok: boolean; pts: string; sum: string; g: GradientColors }[] = [
  { name: "Kafeterija Central", when: "danas", status: "Potvrđeno", ok: true, pts: "+15", sum: "450 RSD", g: ["#D6F7DB", "#A8E8B4"] },
  { name: "Maxi · Novi Beograd", when: "juče", status: "Potvrđeno", ok: true, pts: "+40", sum: "1 620 RSD", g: ["#C5E9FF", "#93D3FA"] },
  { name: "Apoteka Beograd", when: "juče", status: "Provera", ok: false, pts: "u toku", sum: "312 RSD", g: ["#FBEBCF", "#F5D28A"] },
  { name: "Pekara Trocadero", when: "13. jul", status: "Potvrđeno", ok: true, pts: "+8", sum: "240 RSD", g: ["#D6F7DB", "#A8E8B4"] },
];

export function HistoryScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Istorija računa</Text>

        <NeoSurface radius={18} style={styles.card}>
          {ROWS.map((r) => (
            <View key={r.name} style={styles.row}>
              <LinearGradient colors={r.g} style={styles.icon} />
              <View style={styles.mid}>
                <Text style={styles.name}>{r.name}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.when}>{r.when} · </Text>
                  <Text style={[styles.tag, r.ok ? styles.tagOk : styles.tagWait]}>{r.status}</Text>
                </View>
              </View>
              <View style={styles.right}>
                <Text style={[styles.pts, !r.ok && styles.ptsMuted]}>{r.pts}</Text>
                <Text style={styles.sum}>{r.sum}</Text>
              </View>
            </View>
          ))}
        </NeoSurface>

        <NeoSurface radius={18} style={styles.summary}>
          <View>
            <Text style={styles.cardLabel}>Ovog meseca</Text>
            <Text style={styles.summaryVal}>+342 poena</Text>
          </View>
          <View style={styles.pill}><Text style={styles.pillText}>12 računa</Text></View>
        </NeoSurface>
      </ScrollView>
      <Dock active="History" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 100 },
  title: { fontFamily: fontFamily.heavy, fontSize: 18, color: colors.ink, marginBottom: 14 },
  card: { padding: 14, marginBottom: 11 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(195,203,222,0.4)" },
  icon: { width: 40, height: 40, borderRadius: 12 },
  mid: { flex: 1 },
  name: { fontFamily: fontFamily.heavy, fontSize: 13.5, color: colors.ink },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  when: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.ink2 },
  tag: { fontFamily: fontFamily.heavy, fontSize: 9, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  tagOk: { backgroundColor: "#D6F0E4", color: "#2E7D5B" },
  tagWait: { backgroundColor: "#FBEBCF", color: "#9A6E1E" },
  right: { alignItems: "flex-end" },
  pts: { fontFamily: fontFamily.heavy, fontSize: 13.5, color: "#3E9E76" },
  ptsMuted: { color: colors.ink2, fontFamily: fontFamily.bold },
  sum: { fontFamily: fontFamily.bold, fontSize: 10.5, color: colors.ink2 },
  summary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  cardLabel: { fontFamily: fontFamily.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: colors.ink2 },
  summaryVal: { fontFamily: fontFamily.heavy, fontSize: 20, color: colors.ink, marginTop: 3 },
  pill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: "#E7DCF7" },
  pillText: { fontFamily: fontFamily.heavy, fontSize: 10.5, color: "#5A4470" },
});
