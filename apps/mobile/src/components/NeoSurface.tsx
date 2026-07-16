import React from "react";
import { View, StyleSheet, ViewStyle, ViewProps } from "react-native";
import { colors, radii, raisedShadow } from "../theme";

/**
 * Raised neumorphic surface (card / circle). Single-shadow approximation —
 * see theme/index.ts note on the double-shadow caveat.
 */
export function NeoSurface({
  style,
  radius = radii.card,
  children,
  ...rest
}: ViewProps & { radius?: number; style?: ViewStyle }) {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        { borderRadius: radius },
        raisedShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.bg },
});
