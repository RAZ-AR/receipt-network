import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auraStops } from "../theme";

/**
 * Holographic aura behind hero elements (goal ring, result circle, avatar).
 * RN can't do a conic gradient + blur cheaply; this approximates it with a
 * soft linear-gradient disc at low opacity. For a richer look, swap for a
 * pre-rendered blurred PNG. Use ONLY behind hero elements (DESIGN_DIRECTION §1).
 */
export function Aura({ size, style }: { size: number; style?: ViewStyle }) {
  return (
    <LinearGradient
      colors={auraStops}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.aura,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  aura: { position: "absolute", opacity: 0.55 },
});
