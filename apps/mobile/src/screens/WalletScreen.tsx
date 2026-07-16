import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { Dock, DockTab } from "../components/Dock";
import { colors, fontFamily, GradientColors } from "../theme";

const TX: { name: string; when: string; amount: string; positive: boolean; g: GradientColors }[] = [
  { name: "Kafeterija Central", when: "danas · 18:42", amount: "+15", positive: true, g: ["#D6F7DB", "#A8E8B4"] },
  { name: "Besplatni croissant", when: "juče · zamena", amount: "−250", positive: false, g: ["#FFD3E8", "#F5A8CB"] },
  { name: "Maxi · Novi Beograd", when: "juče · 2× akcija", amount: "+40", positive: true, g: ["#C5E9FF", "#93D3FA"] },
];

export function WalletScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Novčanik</Text>

        <View style={styles.balWrap}>
          <Aura size={172} style={{ top: -6, left: -6 }} />
          <NeoSurface radius={86} style={styles.balCircle}>
            <Text style={styles.balNum}>1 240</Text>
            <Text style={styles.balUnit}>poena</Text>
          </NeoSurface>
        </View>

        <NeoSurface radius={18} style={styles.card}>
          <Text style={styles.cardLabel}>Poslednje transakcije</Text>
          {TX.map((t) => (
            <View key={t.name} style={styles.txRow}>
              <LinearGradient colors={t.g} style={styles.txIcon} />
              <View style={styles.txMid}>
                <Text style={styles.txName}>{t.name}</Text>
                <Text style={styles.txWhen}>{t.when}</Text>
              </View>
              <Text style={[styles.txAmount, { color: t.positive ? "#3E9E76" : "#B0607F" }]}>{t.amount}</Text>
            </View>
          ))}
        </NeoSurface>
      </ScrollView>
      <Dock active="Wallet" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 100 },
  title: { fontFamily: fontFamily.heavy, fontSize: 18, color: colors.ink, marginBottom: 14 },
  balWrap: { width: 172, height: 172, alignSelf: "center", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  balCircle: { width: 172, height: 172, alignItems: "center", justifyContent: "center" },
  balNum: { fontFamily: fontFamily.heavy, fontSize: 42, color: colors.ink },
  balUnit: { fontFamily: fontFamily.bold, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginTop: 4 },
  card: { padding: 14 },
  cardLabel: { fontFamily: fontFamily.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: colors.ink2, marginBottom: 6 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "rgba(195,203,222,0.4)" },
  txIcon: { width: 38, height: 38, borderRadius: 12 },
  txMid: { flex: 1 },
  txName: { fontFamily: fontFamily.heavy, fontSize: 13.5, color: colors.ink },
  txWhen: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.ink2, marginTop: 1 },
  txAmount: { fontFamily: fontFamily.heavy, fontSize: 15 },
});
