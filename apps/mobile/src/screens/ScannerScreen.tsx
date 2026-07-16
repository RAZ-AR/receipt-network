import React from "react";
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fontFamily, rainbow } from "../theme";

/**
 * QR-first scanner (ADR-P-013). The live camera feed will come from
 * `expo-camera` during Sprint 1 polish; here the viewfinder sits over a soft
 * gradient. The shutter simulates a successful decode + verify.
 */
export function ScannerScreen({ onClose, onScanned }: { onClose: () => void; onScanned: () => void }) {
  return (
    <LinearGradient colors={["#F4F6FB", "#DDE3EF", "#CBD3E4"]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Pressable onPress={onClose} style={styles.iconBtn}>
            <Text style={styles.icon}>✕</Text>
          </Pressable>
          <Text style={styles.title}>Skeniraj QR sa računa</Text>
          <View style={styles.iconBtn} />
        </View>

        <View style={styles.frameArea}>
          <View style={styles.frame}>
            <Corner style={styles.tl} />
            <Corner style={styles.tr} />
            <Corner style={styles.bl} />
            <Corner style={styles.br} />
            <View style={styles.glassCard}>
              <Text style={styles.qr}>▚▚</Text>
            </View>
          </View>
        </View>

        <Text style={styles.hint}>Uperi kameru u fiskalni QR — Beleg ga proverava kod TaxCore za par sekundi.</Text>

        <View style={styles.controls}>
          <View style={styles.ctlBtn}><Text style={styles.ctlIcon}>▤</Text></View>
          <Pressable onPress={onScanned} style={styles.shutter}>
            <LinearGradient
              colors={rainbow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.ctlBtn}><Text style={styles.ctlIcon}>▦</Text></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Corner({ style }: { style: StyleProp<ViewStyle> }) {
  return <View style={[styles.corner, style]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, justifyContent: "space-between" },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  icon: { color: colors.ink, fontSize: 15 },
  title: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.ink },
  frameArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  frame: { width: 200, height: 200 },
  corner: { position: "absolute", width: 34, height: 34, borderColor: "#7FB6E8" },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 14 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 14 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 14 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 14 },
  glassCard: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  qr: { fontSize: 44, color: "#5A6478", opacity: 0.5 },
  hint: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.ink2, textAlign: "center", paddingHorizontal: 30, marginBottom: 18 },
  controls: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 24, paddingBottom: 28 },
  ctlBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.5)", borderWidth: 1, borderColor: "rgba(255,255,255,0.8)", alignItems: "center", justifyContent: "center" },
  ctlIcon: { fontSize: 20, color: colors.ink },
  shutter: { width: 70, height: 70, borderRadius: 35, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(255,255,255,0.85)", borderWidth: 2, borderColor: "rgba(255,255,255,0.95)" },
});
