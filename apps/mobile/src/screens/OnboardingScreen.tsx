import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { GlassButton } from "../components/GlassButton";
import { colors, auraStops, fontFamily } from "../theme";

/** First screen — the promise, then straight to the first scan (min barrier). */
export function OnboardingScreen({ onScan, onSignIn }: { onScan: () => void; onSignIn: () => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.hero}>
        <View style={styles.orbWrap}>
          <Aura size={210} style={{ top: -10, left: -10 }} />
          <NeoSurface radius={95} style={styles.orb}>
            <LinearGradient
              colors={auraStops as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.orbInner}
            />
          </NeoSurface>
        </View>
        <Text style={styles.h}>Kupuj kao i uvek.{"\n"}Dobij više.</Text>
        <Text style={styles.p}>
          Skeniraj račun iz bilo koje radnje — dobij poene, srećke i približi se nagradi.
        </Text>
      </View>

      <View style={styles.foot}>
        <GlassButton label="Skeniraj prvi račun" onPress={onScan} />
        <Text style={styles.ghost} onPress={onSignIn}>
          Već imam nalog
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 22 },
  hero: { flex: 1, alignItems: "center", justifyContent: "center" },
  orbWrap: { width: 190, height: 190, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  orb: { width: 190, height: 190, alignItems: "center", justifyContent: "center" },
  orbInner: { width: 118, height: 118, borderRadius: 59 },
  h: {
    fontFamily: fontFamily.heavy,
    fontSize: 26,
    color: colors.ink,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 10,
  },
  p: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.ink2,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
  foot: { paddingBottom: 24, gap: 10 },
  ghost: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.ink2, textAlign: "center", paddingVertical: 12 },
});
