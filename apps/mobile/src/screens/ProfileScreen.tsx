import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { Dock, DockTab } from "../components/Dock";
import { colors, fontFamily } from "../theme";

const STATS = [
  { v: "54", l: "računa" },
  { v: "1 240", l: "poena" },
  { v: "7", l: "srećaka" },
];

const SETTINGS = [
  { icon: "🎁", name: "Moja cilj-nagrada", right: "Kafa" },
  { icon: "🔔", name: "Obaveštenja", right: "›" },
  { icon: "🛡", name: "Privatnost i podaci", right: "›" },
  { icon: "🔒", name: "Bezbednost naloga", right: "›" },
];

export function ProfileScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View style={styles.avatarWrap}>
            <Aura size={92} style={{ top: -8, left: -8 }} />
            <NeoSurface radius={46} style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </NeoSurface>
          </View>
          <Text style={styles.name}>Marko Marković</Text>
          <Text style={styles.city}>Beograd · član od maja 2026</Text>
        </View>

        <View style={styles.statGrid}>
          {STATS.map((s) => (
            <View key={s.l} style={styles.statBox}>
              <Text style={styles.statVal}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        <NeoSurface radius={18} style={styles.card}>
          {SETTINGS.map((s) => (
            <View key={s.name} style={styles.setRow}>
              <View style={styles.setIcon}><Text style={styles.setIconText}>{s.icon}</Text></View>
              <Text style={styles.setName}>{s.name}</Text>
              <Text style={styles.setRight}>{s.right}</Text>
            </View>
          ))}
        </NeoSurface>
      </ScrollView>
      <Dock active="Profile" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 100 },
  head: { alignItems: "center", marginBottom: 16 },
  avatarWrap: { width: 92, height: 92, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatar: { width: 92, height: 92, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontFamily.heavy, fontSize: 30, color: colors.ink },
  name: { fontFamily: fontFamily.heavy, fontSize: 20, color: colors.ink },
  city: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.ink2, marginTop: 3 },
  statGrid: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statBox: { flex: 1, borderRadius: 16, backgroundColor: colors.bg, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: colors.track },
  statVal: { fontFamily: fontFamily.heavy, fontSize: 19, color: colors.ink },
  statLabel: { fontFamily: fontFamily.bold, fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", color: colors.ink2, marginTop: 4 },
  card: { paddingHorizontal: 15 },
  setRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "rgba(195,203,222,0.4)" },
  setIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.track },
  setIconText: { fontSize: 15 },
  setName: { flex: 1, fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.ink },
  setRight: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.ink2 },
});
