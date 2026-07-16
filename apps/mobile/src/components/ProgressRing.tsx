import React from "react";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, ringGradient } from "../theme";

/**
 * Goal progress ring with the pink -> lilac -> blue gradient stroke.
 * `progress` is 0..1.
 */
export function ProgressRing({
  size = 188,
  stroke = 13,
  progress,
}: {
  size?: number;
  stroke?: number;
  progress: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, progress)));
  const center = size / 2;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ringGradient[0]} />
          <Stop offset="0.5" stopColor={ringGradient[1]} />
          <Stop offset="1" stopColor={ringGradient[2]} />
        </LinearGradient>
      </Defs>
      <Circle cx={center} cy={center} r={r} stroke={colors.track} strokeWidth={stroke} fill="none" />
      <Circle
        cx={center}
        cy={center}
        r={r}
        stroke="url(#ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        fill="none"
        transform={`rotate(-90 ${center} ${center})`}
      />
    </Svg>
  );
}
