import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { GlassButton } from "../components/GlassButton";
import { colors, fontFamily } from "../theme";

/** Phone sign-in — appears after the first result, not before the first scan. */
export function AuthScreen({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <View style={styles.top}>
        <View style={styles.orbWrap}>
          <Aura size={90} style={{ top: -6, left: -6 }} />
          <NeoSurface radius={24} style={styles.orb}>
            <Text style={styles.orbGlyph}>☎</Text>
          </NeoSurface>
        </View>
        <Text style={styles.h}>Tvoj broj telefona</Text>
        <Text style={styles.sub}>Šaljemo ti SMS kod da sačuvamo{"\n"}poene sa prvog računa.</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.flag}>🇷🇸</Text>
        <Text style={styles.pre}>+381</Text>
        <Text style={styles.num}>6X XXX XXXX</Text>
      </View>

      <GlassButton label="Pošalji kod" onPress={onSubmit} />

      <View style={styles.consent}>
        <View style={styles.checkbox}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.consentText}>
          Prihvatam uslove korišćenja i politiku privatnosti. Marketing je odvojen.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 22 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginTop: 4 },
  backText: { fontSize: 26, color: colors.ink, marginTop: -4 },
  top: { alignItems: "center", marginTop: 12, marginBottom: 20 },
  orbWrap: { width: 78, height: 78, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  orb: { width: 78, height: 78, alignItems: "center", justifyContent: "center" },
  orbGlyph: { fontSize: 30, color: "#8B6FC0" },
  h: { fontFamily: fontFamily.heavy, fontSize: 22, color: colors.ink, marginBottom: 6 },
  sub: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.ink2, textAlign: "center", lineHeight: 20 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.bg,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.track,
  },
  flag: { fontSize: 18 },
  pre: { fontFamily: fontFamily.heavy, fontSize: 15, color: colors.ink },
  num: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.ink2, letterSpacing: 1 },
  consent: { flexDirection: "row", gap: 9, alignItems: "flex-start", marginTop: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: "#B99CFF", alignItems: "center", justifyContent: "center" },
  check: { color: "#fff", fontSize: 12 },
  consentText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 11, color: colors.ink2, lineHeight: 17 },
});
