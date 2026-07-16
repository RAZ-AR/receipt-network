import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { ReceiptResultState } from "@beleg/shared-types";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { GlassButton } from "../components/GlassButton";
import { colors, fontFamily, GradientColors } from "../theme";

type Variant = {
  auraColors: GradientColors;
  glyphColors: GradientColors;
  glyph: string;
  chipBg: string;
  chipText: string;
  chip: string;
  title: string;
  cta: string;
};

// Maps each result state to its visual config (see the states design + FR-4).
const VARIANTS: Record<ReceiptResultState, Variant> = {
  SUCCESS: {
    auraColors: ["#D6F7DB", "#C5E9FF", "#DFCFFF"],
    glyphColors: ["#A8E8B4", "#7FD4C0"],
    glyph: "✓",
    chipBg: "#D6F0E4",
    chipText: "#2E7D5B",
    chip: "TaxCore potvrđeno",
    title: "Hvala! Račun je primljen",
    cta: "Nastavi",
  },
  QR_UNREADABLE: {
    auraColors: ["#FFE4C4", "#FFD9B0"],
    glyphColors: ["#FFD9A8", "#F5BE7E"],
    glyph: "!",
    chipBg: "#FBEBCF",
    chipText: "#9A6E1E",
    chip: "Nije pročitano",
    title: "Ne možemo da pročitamo QR kod",
    cta: "Slikaj ponovo",
  },
  INVALID: {
    auraColors: ["#FFD3D9", "#FFCBE0"],
    glyphColors: ["#F5B8C8", "#E89AB0"],
    glyph: "✕",
    chipBg: "#FADBE2",
    chipText: "#A24E6C",
    chip: "Odbijeno",
    title: "Račun nije važeći",
    cta: "Skeniraj drugi račun",
  },
  TOO_OLD: {
    auraColors: ["#FFE4C4", "#FFD9B0"],
    glyphColors: ["#FFD9A8", "#F5BE7E"],
    glyph: "⏱",
    chipBg: "#FBEBCF",
    chipText: "#9A6E1E",
    chip: "Isteklo",
    title: "Račun je stariji od 3 dana",
    cta: "U redu",
  },
  DUPLICATE: {
    auraColors: ["#FFD3D9", "#FFCBE0"],
    glyphColors: ["#F5B8C8", "#E89AB0"],
    glyph: "⧉",
    chipBg: "#FADBE2",
    chipText: "#A24E6C",
    chip: "Duplikat",
    title: "Ovaj račun je već dodat",
    cta: "Vidi u istoriji",
  },
};

export function ResultScreen({
  state = "SUCCESS",
  points = 8,
  ticketNumber = "BG2200777",
  onContinue,
}: {
  state?: ReceiptResultState;
  points?: number;
  ticketNumber?: string;
  onContinue: () => void;
}) {
  const v = VARIANTS[state];
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <View style={styles.orbWrap}>
          <Aura size={170} style={{ top: -10, left: -10 }} />
          <NeoSurface radius={75} style={styles.orb}>
            <LinearGradient colors={v.glyphColors} style={styles.glyphWrap}>
              <Text style={styles.glyph}>{v.glyph}</Text>
            </LinearGradient>
          </NeoSurface>
        </View>

        <View style={[styles.chip, { backgroundColor: v.chipBg }]}>
          <Text style={[styles.chipText, { color: v.chipText }]}>{v.chip}</Text>
        </View>

        <Text style={styles.title}>{v.title}</Text>

        {state === "SUCCESS" && (
          <>
            <View style={styles.pointsRow}>
              <Text style={styles.points}>+{points}</Text>
              <Text style={styles.pointsUnit}>poena</Text>
            </View>
            <NeoSurface radius={18} style={styles.ticket}>
              <View>
                <Text style={styles.ticketLabel}>Tvoj broj srećke</Text>
                <Text style={styles.ticketNum}>{ticketNumber}</Text>
              </View>
            </NeoSurface>
          </>
        )}
      </View>

      <View style={styles.foot}>
        <GlassButton label={v.cta} onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 22 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  orbWrap: { width: 150, height: 150, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  orb: { width: 150, height: 150, alignItems: "center", justifyContent: "center" },
  glyphWrap: { width: 86, height: 86, borderRadius: 43, alignItems: "center", justifyContent: "center" },
  glyph: { fontSize: 38, color: "#fff", fontFamily: fontFamily.heavy },
  chip: { borderRadius: 999, paddingHorizontal: 13, paddingVertical: 6, marginBottom: 16 },
  chipText: { fontFamily: fontFamily.heavy, fontSize: 11.5 },
  title: { fontFamily: fontFamily.heavy, fontSize: 23, color: colors.ink, textAlign: "center", maxWidth: 280 },
  pointsRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginTop: 6, marginBottom: 14 },
  points: { fontFamily: fontFamily.heavy, fontSize: 52, color: "#B99CFF" },
  pointsUnit: { fontFamily: fontFamily.heavy, fontSize: 16, color: colors.ink2, marginBottom: 8 },
  ticket: { width: "100%", padding: 16 },
  ticketLabel: { fontFamily: fontFamily.bold, fontSize: 9.5, letterSpacing: 1, color: colors.ink2, textTransform: "uppercase" },
  ticketNum: { fontFamily: fontFamily.heavy, fontSize: 19, color: colors.ink, letterSpacing: 1, marginTop: 3 },
  foot: { paddingBottom: 24 },
});
