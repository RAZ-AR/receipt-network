import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { ReceiptResultState } from "@beleg/shared-types";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { GlassButton } from "../components/GlassButton";
import { Dock, DockTab } from "../components/Dock";
import { api } from "../api/client";
import { colors, fontFamily, s, GradientColors, DOCK_CLEARANCE } from "../theme";

type Variant = {
  glyphColors: GradientColors;
  glyph: string;
  chipBg: string;
  chipText: string;
  chip: string;
  title: string;
  cta: string;
};

// One config per result state (the states design + FR-4).
const VARIANTS: Record<ReceiptResultState, Variant> = {
  SUCCESS: {
    glyphColors: ["#A8E8B4", "#7FD4C0"],
    glyph: "✓",
    chipBg: "#D6F0E4",
    chipText: "#2E7D5B",
    chip: "TaxCore potvrđeno",
    title: "Hvala! Račun je primljen",
    cta: "Nastavi",
  },
  PENDING_REVIEW: {
    glyphColors: ["#C3ECFF", "#93C8F0"],
    glyph: "⏳",
    chipBg: "#DCEBF8",
    chipText: "#2E6E9E",
    chip: "Poslato na proveru",
    title: "Račun je poslat na proveru",
    cta: "U redu",
  },
  QR_UNREADABLE: {
    glyphColors: ["#FFD9A8", "#F5BE7E"],
    glyph: "!",
    chipBg: "#FBEBCF",
    chipText: "#9A6E1E",
    chip: "Nije pročitano",
    title: "Ne možemo da pročitamo QR kod",
    cta: "Slikaj ponovo",
  },
  INVALID: {
    glyphColors: ["#F5B8C8", "#E89AB0"],
    glyph: "✕",
    chipBg: "#FADBE2",
    chipText: "#A24E6C",
    chip: "Odbijeno",
    title: "Račun nije važeći",
    cta: "Skeniraj drugi račun",
  },
  TOO_OLD: {
    glyphColors: ["#FFD9A8", "#F5BE7E"],
    glyph: "⏱",
    chipBg: "#FBEBCF",
    chipText: "#9A6E1E",
    chip: "Isteklo",
    title: "Račun je stariji od 3 dana",
    cta: "U redu",
  },
  DUPLICATE: {
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
  receiptUrl,
  initialState,
  onContinue,
  onNavigate,
}: {
  receiptUrl?: string;
  /** Set directly when there is nothing to verify (e.g. manual entry). */
  initialState?: ReceiptResultState;
  onContinue: () => void;
  onNavigate: (t: DockTab) => void;
}) {
  const [state, setState] = useState<ReceiptResultState | null>(
    initialState ?? (receiptUrl ? null : "SUCCESS")
  );
  const [receipt, setReceipt] = useState<{ merchant?: string; totalAmount?: number } | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  // The server verifies and decides — the client only reports what it scanned.
  useEffect(() => {
    if (!receiptUrl) return;
    let cancelled = false;
    api.receipts.submit
      .mutate({ receiptUrl })
      .then((r) => {
        if (cancelled) return;
        if (r.state === "SUCCESS") {
          setReceipt({ merchant: r.merchant, totalAmount: r.totalAmount });
          setPoints(r.points);
        }
        setState(r.state);
      })
      .catch(() => !cancelled && setState("INVALID"));
    return () => {
      cancelled = true;
    };
  }, [receiptUrl]);

  if (state === null) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.ink2} />
        <Text style={styles.loadingText}>Proveravamo račun kod TaxCore…</Text>
      </SafeAreaView>
    );
  }

  const v = VARIANTS[state];

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <View style={styles.orbWrap}>
          <Aura size={s(170)} style={{ top: -s(10), left: -s(10) }} />
          <NeoSurface radius={s(75)} style={styles.orb}>
            <LinearGradient colors={v.glyphColors} style={styles.glyphWrap}>
              <Text style={styles.glyph}>{v.glyph}</Text>
            </LinearGradient>
          </NeoSurface>
        </View>

        <View style={[styles.chip, { backgroundColor: v.chipBg }]}>
          <Text style={[styles.chipText, { color: v.chipText }]}>{v.chip}</Text>
        </View>

        <Text style={styles.title}>{v.title}</Text>

        {state === "PENDING_REVIEW" && (
          <Text style={styles.pendingText}>
            Proveravamo podatke ručno. Poeni stižu čim potvrdimo račun — obavestićemo te.
          </Text>
        )}

        {state === "SUCCESS" && (
          <>
            <View style={styles.pointsRow}>
              <Text style={styles.points}>+{points ?? 0}</Text>
              <Text style={styles.pointsUnit}>poena</Text>
            </View>
            {receipt?.merchant || receipt?.totalAmount ? (
              <NeoSurface radius={s(18)} style={styles.card}>
                <Text style={styles.cardLabel}>Račun</Text>
                {receipt.merchant ? <Text style={styles.merchant}>{receipt.merchant}</Text> : null}
                {receipt.totalAmount ? (
                  <Text style={styles.receiptLine}>{receipt.totalAmount} RSD · potvrđeno kod TaxCore</Text>
                ) : null}
              </NeoSurface>
            ) : null}
          </>
        )}
      </View>

      <View style={styles.foot}>
        <GlassButton label={v.cta} onPress={onContinue} />
      </View>

      <Dock onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: s(22) },
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", gap: s(14) },
  loadingText: { fontFamily: fontFamily.bold, fontSize: s(13), color: colors.ink2 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  orbWrap: { width: s(150), height: s(150), alignItems: "center", justifyContent: "center", marginBottom: s(22) },
  orb: { width: s(150), height: s(150), alignItems: "center", justifyContent: "center" },
  glyphWrap: { width: s(86), height: s(86), borderRadius: s(43), alignItems: "center", justifyContent: "center" },
  glyph: { fontSize: s(38), color: "#fff", fontFamily: fontFamily.heavy },
  chip: { borderRadius: 999, paddingHorizontal: s(13), paddingVertical: s(6), marginBottom: s(16) },
  chipText: { fontFamily: fontFamily.heavy, fontSize: s(11.5) },
  title: { fontFamily: fontFamily.heavy, fontSize: s(23), color: colors.ink, textAlign: "center", maxWidth: s(280) },
  pointsRow: { flexDirection: "row", alignItems: "flex-end", gap: s(6), marginTop: s(6), marginBottom: s(14) },
  points: { fontFamily: fontFamily.heavy, fontSize: s(52), color: "#B99CFF" },
  pointsUnit: { fontFamily: fontFamily.heavy, fontSize: s(16), color: colors.ink2, marginBottom: s(8) },
  card: { width: "100%", padding: s(16) },
  cardLabel: { fontFamily: fontFamily.bold, fontSize: s(9.5), letterSpacing: 1, color: colors.ink2, textTransform: "uppercase" },
  merchant: { fontFamily: fontFamily.heavy, fontSize: s(16), color: colors.ink, marginTop: s(4) },
  receiptLine: { fontFamily: fontFamily.bold, fontSize: s(11.5), color: colors.ink2, marginTop: s(8) },
  pendingText: {
    fontFamily: fontFamily.regular,
    fontSize: s(13),
    color: colors.ink2,
    textAlign: "center",
    lineHeight: s(20),
    marginTop: s(10),
    maxWidth: s(290),
  },
  foot: { paddingBottom: DOCK_CLEARANCE },
});
