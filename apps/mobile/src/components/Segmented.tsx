import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, fontFamily, s } from "../theme";

/** Inset segmented control used inside screens (Wallet, Rewards). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.btn, active && styles.btnOn]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.textOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    borderRadius: s(14),
    padding: s(4),
    marginBottom: s(13),
    borderWidth: 1,
    borderColor: colors.track,
  },
  btn: { flex: 1, alignItems: "center", paddingVertical: s(10), borderRadius: s(11) },
  btnOn: { backgroundColor: "#fff" },
  text: { fontFamily: fontFamily.heavy, fontSize: s(12.5), color: colors.ink2 },
  textOn: { color: colors.ink },
});
