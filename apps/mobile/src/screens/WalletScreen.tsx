import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { ScreenLayout } from "../components/ScreenLayout";
import type { DockTab } from "../components/Dock";
import { colors, fontFamily, s, GradientColors } from "../theme";

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

export function WalletScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  return (
    <ScreenLayout title="Novčanik" active="Wallet" onNavigate={onNavigate}>
      <View style={styles.balWrap}>
        <Aura size={s(168)} style={{ top: -s(6), left: -s(6) }} />
        <NeoSurface radius={s(84)} style={styles.balCircle}>
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
          <View key={t.name} style={styles.txRow}>
            <LinearGradient colors={t.g} style={styles.txIcon}>
              <Ionicons name={t.icon} size={s(17)} color="#3E6F58" />
            </LinearGradient>
            <View style={styles.txMid}>
              <Text style={styles.txName}>{t.name}</Text>
              <Text style={styles.txWhen}>{t.when}</Text>
            </View>
            <Text style={[styles.txAmount, { color: t.positive ? "#3E9E76" : "#B0607F" }]}>{t.amount}</Text>
          </View>
        ))}
      </NeoSurface>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  balWrap: { width: s(168), height: s(168), alignSelf: "center", alignItems: "center", justifyContent: "center", marginBottom: s(14) },
  balCircle: { width: s(168), height: s(168), alignItems: "center", justifyContent: "center" },
  balNum: { fontFamily: fontFamily.heavy, fontSize: s(42), color: colors.ink, letterSpacing: -1 },
  balUnit: { fontFamily: fontFamily.bold, fontSize: s(11), letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginTop: s(4) },
  pillRow: { alignItems: "center", marginBottom: s(16) },
  pill: { borderRadius: 999, paddingHorizontal: s(12), paddingVertical: s(5), backgroundColor: "#E7DCF7" },
  pillText: { fontFamily: fontFamily.heavy, fontSize: s(10.5), color: "#5A4470" },
  card: { padding: s(14) },
  cardLabel: { fontFamily: fontFamily.bold, fontSize: s(10), letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginBottom: s(6) },
  txRow: { flexDirection: "row", alignItems: "center", gap: s(12), paddingVertical: s(11), borderBottomWidth: 1, borderBottomColor: "rgba(195,203,222,0.4)" },
  txIcon: { width: s(38), height: s(38), borderRadius: s(12), alignItems: "center", justifyContent: "center" },
  txMid: { flex: 1 },
  txName: { fontFamily: fontFamily.heavy, fontSize: s(13.5), color: colors.ink },
  txWhen: { fontFamily: fontFamily.bold, fontSize: s(11), color: colors.ink2, marginTop: s(1) },
  txAmount: { fontFamily: fontFamily.heavy, fontSize: s(15) },
});
