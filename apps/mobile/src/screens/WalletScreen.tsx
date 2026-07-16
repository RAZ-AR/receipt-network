import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { Segmented } from "../components/Segmented";
import { ScreenLayout } from "../components/ScreenLayout";
import type { DockTab } from "../components/Dock";
import { colors, fontFamily, s, GradientColors } from "../theme";

type Tab = "balance" | "history";

const TX: {
  name: string;
  when: string;
  amount: string;
  positive: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  g: GradientColors;
}[] = [
  { name: "Kafeterija Central", when: "danas · 18:42", amount: "+15", positive: true, icon: "receipt-outline", g: ["#D6F7DB", "#A8E8B4"] },
  { name: "Besplatni croissant", when: "juče · zamena", amount: "−250", positive: false, icon: "gift-outline", g: ["#FFD3E8", "#F5A8CB"] },
  { name: "Maxi · Novi Beograd", when: "juče · 2× akcija", amount: "+40", positive: true, icon: "receipt-outline", g: ["#C5E9FF", "#93D3FA"] },
];

const RECEIPTS: { name: string; when: string; status: string; ok: boolean; pts: string; sum: string; g: GradientColors }[] = [
  { name: "Kafeterija Central", when: "danas", status: "Potvrđeno", ok: true, pts: "+15", sum: "450 RSD", g: ["#D6F7DB", "#A8E8B4"] },
  { name: "Maxi · Novi Beograd", when: "juče", status: "Potvrđeno", ok: true, pts: "+40", sum: "1 620 RSD", g: ["#C5E9FF", "#93D3FA"] },
  { name: "Apoteka Beograd", when: "juče", status: "Provera", ok: false, pts: "u toku", sum: "312 RSD", g: ["#FBEBCF", "#F5D28A"] },
  { name: "Pekara Trocadero", when: "13. jul", status: "Potvrđeno", ok: true, pts: "+8", sum: "240 RSD", g: ["#D6F7DB", "#A8E8B4"] },
];

export function WalletScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  const [tab, setTab] = useState<Tab>("balance");

  return (
    <ScreenLayout title="Novčanik" active="Wallet" onNavigate={onNavigate}>
      <Segmented<Tab>
        options={[
          { key: "balance", label: "Stanje" },
          { key: "history", label: "Istorija" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "balance" ? (
        <>
          <View style={styles.balWrap}>
            <Aura size={s(160)} style={{ top: -s(6), left: -s(6) }} />
            <NeoSurface radius={s(80)} style={styles.balCircle}>
              <Text style={styles.balNum}>1 240</Text>
              <Text style={styles.balUnit}>poena</Text>
            </NeoSurface>
          </View>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>+15 danas · 7 srećaka</Text>
            </View>
          </View>

          <NeoSurface radius={s(18)} style={styles.card}>
            <Text style={styles.cardLabel}>Poslednje transakcije</Text>
            {TX.map((t) => (
              <View key={t.name} style={styles.row}>
                <LinearGradient colors={t.g} style={styles.icon}>
                  <Ionicons name={t.icon} size={s(17)} color="#3E6F58" />
                </LinearGradient>
                <View style={styles.mid}>
                  <Text style={styles.name}>{t.name}</Text>
                  <Text style={styles.sub}>{t.when}</Text>
                </View>
                <Text style={[styles.amount, { color: t.positive ? "#3E9E76" : "#B0607F" }]}>{t.amount}</Text>
              </View>
            ))}
          </NeoSurface>
        </>
      ) : (
        <>
          <NeoSurface radius={s(18)} style={styles.card}>
            {RECEIPTS.map((r) => (
              <View key={r.name} style={styles.row}>
                <LinearGradient colors={r.g} style={styles.icon}>
                  <Ionicons name={r.ok ? "checkmark" : "time-outline"} size={s(16)} color={r.ok ? "#3E8060" : "#9A6E1E"} />
                </LinearGradient>
                <View style={styles.mid}>
                  <Text style={styles.name}>{r.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.sub}>{r.when} · </Text>
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

          <NeoSurface radius={s(18)} style={styles.summary}>
            <View>
              <Text style={styles.cardLabel}>Ovog meseca</Text>
              <Text style={styles.summaryVal}>+342 poena</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>12 računa</Text>
            </View>
          </NeoSurface>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  balWrap: { width: s(160), height: s(160), alignSelf: "center", alignItems: "center", justifyContent: "center", marginBottom: s(14) },
  balCircle: { width: s(160), height: s(160), alignItems: "center", justifyContent: "center" },
  balNum: { fontFamily: fontFamily.heavy, fontSize: s(40), color: colors.ink, letterSpacing: -1 },
  balUnit: { fontFamily: fontFamily.bold, fontSize: s(11), letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginTop: s(4) },
  pillRow: { alignItems: "center", marginBottom: s(16) },
  pill: { borderRadius: 999, paddingHorizontal: s(12), paddingVertical: s(5), backgroundColor: "#E7DCF7" },
  pillText: { fontFamily: fontFamily.heavy, fontSize: s(10.5), color: "#5A4470" },
  card: { padding: s(14), marginBottom: s(11) },
  cardLabel: { fontFamily: fontFamily.bold, fontSize: s(10), letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginBottom: s(6) },
  row: { flexDirection: "row", alignItems: "center", gap: s(12), paddingVertical: s(11), borderBottomWidth: 1, borderBottomColor: "rgba(195,203,222,0.4)" },
  icon: { width: s(38), height: s(38), borderRadius: s(12), alignItems: "center", justifyContent: "center" },
  mid: { flex: 1 },
  name: { fontFamily: fontFamily.heavy, fontSize: s(13.5), color: colors.ink },
  sub: { fontFamily: fontFamily.bold, fontSize: s(11), color: colors.ink2, marginTop: s(1) },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: s(2) },
  amount: { fontFamily: fontFamily.heavy, fontSize: s(15) },
  tag: { fontFamily: fontFamily.heavy, fontSize: s(9), paddingHorizontal: s(7), paddingVertical: s(2), borderRadius: 999, overflow: "hidden" },
  tagOk: { backgroundColor: "#D6F0E4", color: "#2E7D5B" },
  tagWait: { backgroundColor: "#FBEBCF", color: "#9A6E1E" },
  right: { alignItems: "flex-end" },
  pts: { fontFamily: fontFamily.heavy, fontSize: s(13.5), color: "#3E9E76" },
  ptsMuted: { color: colors.ink2, fontFamily: fontFamily.bold },
  sum: { fontFamily: fontFamily.bold, fontSize: s(10.5), color: colors.ink2 },
  summary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: s(14) },
  summaryVal: { fontFamily: fontFamily.heavy, fontSize: s(20), color: colors.ink, marginTop: s(3) },
});
