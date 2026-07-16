import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { ScreenLayout } from "../components/ScreenLayout";
import type { DockTab } from "../components/Dock";
import { colors, fontFamily, s } from "../theme";

const STATS = [
  { v: "54", l: "računa" },
  { v: "1 240", l: "poena" },
  { v: "7", l: "srećaka" },
];

const SETTINGS: { icon: keyof typeof Ionicons.glyphMap; name: string; right: string }[] = [
  { icon: "gift-outline", name: "Moja cilj-nagrada", right: "Kafa" },
  { icon: "notifications-outline", name: "Obaveštenja", right: "" },
  { icon: "shield-checkmark-outline", name: "Privatnost i podaci", right: "" },
  { icon: "lock-closed-outline", name: "Bezbednost naloga", right: "" },
];

export function ProfileScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  return (
    <ScreenLayout active="Profile" onNavigate={onNavigate}>
      <View style={styles.head}>
        <View style={styles.avatarWrap}>
          <Aura size={s(90)} style={{ top: -s(8), left: -s(8) }} />
          <NeoSurface radius={s(45)} style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </NeoSurface>
        </View>
        <Text style={styles.name}>Marko Marković</Text>
        <Text style={styles.city}>Beograd · član od maja 2026</Text>
      </View>

      <View style={styles.statGrid}>
        {STATS.map((st) => (
          <View key={st.l} style={styles.statBox}>
            <Text style={styles.statVal}>{st.v}</Text>
            <Text style={styles.statLabel}>{st.l}</Text>
          </View>
        ))}
      </View>

      <NeoSurface radius={s(18)} style={styles.card}>
        {SETTINGS.map((st) => (
          <View key={st.name} style={styles.setRow}>
            <View style={styles.setIcon}>
              <Ionicons name={st.icon} size={s(16)} color={colors.ink} />
            </View>
            <Text style={styles.setName}>{st.name}</Text>
            {st.right ? <Text style={styles.setRight}>{st.right}</Text> : null}
            <Ionicons name="chevron-forward" size={s(16)} color={colors.ink2} />
          </View>
        ))}
      </NeoSurface>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: "center", marginBottom: s(18), marginTop: s(6) },
  avatarWrap: { width: s(90), height: s(90), alignItems: "center", justifyContent: "center", marginBottom: s(12) },
  avatar: { width: s(90), height: s(90), alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontFamily.heavy, fontSize: s(30), color: colors.ink },
  name: { fontFamily: fontFamily.heavy, fontSize: s(20), color: colors.ink },
  city: { fontFamily: fontFamily.bold, fontSize: s(12), color: colors.ink2, marginTop: s(3) },
  statGrid: { flexDirection: "row", gap: s(10), marginBottom: s(14) },
  statBox: { flex: 1, borderRadius: s(16), backgroundColor: colors.bg, paddingVertical: s(12), alignItems: "center", borderWidth: 1, borderColor: colors.track },
  statVal: { fontFamily: fontFamily.heavy, fontSize: s(19), color: colors.ink },
  statLabel: { fontFamily: fontFamily.bold, fontSize: s(9), letterSpacing: 0.5, textTransform: "uppercase", color: colors.ink2, marginTop: s(4) },
  card: { paddingHorizontal: s(15) },
  setRow: { flexDirection: "row", alignItems: "center", gap: s(12), paddingVertical: s(13), borderBottomWidth: 1, borderBottomColor: "rgba(195,203,222,0.4)" },
  setIcon: { width: s(34), height: s(34), borderRadius: s(11), backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.track },
  setName: { flex: 1, fontFamily: fontFamily.bold, fontSize: s(13.5), color: colors.ink },
  setRight: { fontFamily: fontFamily.bold, fontSize: s(13), color: colors.ink2 },
});
