import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii, fontFamily } from "../theme";

/**
 * Liquid-glass CTA: blur + translucent white + hairline border + pastel sheen.
 * Matches the mockups' primary button.
 */
export function GlassButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <View style={styles.wrap}>
        <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["rgba(255,201,226,0.45)", "rgba(223,207,255,0.45)", "rgba(197,233,255,0.45)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.control,
    overflow: "hidden",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  label: { fontFamily: fontFamily.heavy, fontSize: 15, color: colors.ink },
  pressed: { transform: [{ scale: 0.98 }] },
});
