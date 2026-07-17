import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NeoSurface } from "../components/NeoSurface";
import { Aura } from "../components/Aura";
import { Segmented } from "../components/Segmented";
import { ScreenLayout } from "../components/ScreenLayout";
import type { DockTab } from "../components/Dock";
import { colors, fontFamily, s, GradientColors } from "../theme";
import { MAX_ACTIVE_GOALS } from "@beleg/shared-types";
import { api } from "../api/client";

type Catalog = {
  balance: number;
  rewards: {
    id: string;
    title: string;
    pointsCost: number;
    vendor: string | null;
    affordable: boolean;
    remaining: number;
  }[];
};

// Thumbnails are decorative; the catalog has no images yet.
const THUMBS: GradientColors[] = [
  ["#FFD3E8", "#D9CBFF"],
  ["#C3ECFF", "#A8E8B4"],
  ["#FFE4C4", "#FFB8A8"],
  ["#DFCFFF", "#C3ECFF"],
];

export function RewardsScreen({ onNavigate }: { onNavigate: (t: DockTab) => void }) {
  const [tab, setTab] = useState<"catalog" | "soon">("catalog");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    api.rewards.list
      .query()
      .then(setCatalog)
      .catch(() => setFailed(true));
  };
  useEffect(load, []);

  const redeem = async (id: string, title: string) => {
    setBusy(id);
    try {
      const r = await api.rewards.redeem.mutate({ rewardId: id });
      if (r.state === "SUCCESS") {
        Alert.alert(title, `Tvoj kod: ${r.code}\n\nPokaži ga na kasi. Važi 14 dana.`);
        load();
      } else if (r.state === "INSUFFICIENT") {
        Alert.alert("Nedovoljno poena", `Nedostaje još ${r.needed} poena.`);
      } else if (r.state === "OUT_OF_STOCK") {
        Alert.alert("Nema više", "Ova nagrada je trenutno rasprodata.");
      } else {
        Alert.alert("Nedostupno", "Ova nagrada trenutno nije dostupna.");
      }
    } catch {
      Alert.alert("Greška", "Server nije dostupan.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <ScreenLayout
      title="Nagrade"
      headerRight={
        <View style={styles.pill}>
          <Text style={styles.pillText}>{tab === "catalog" ? `${catalog?.balance ?? 0} p` : "🎁"}</Text>
        </View>
      }
      active="Rewards"
      onNavigate={onNavigate}
    >
      <Segmented<"catalog" | "soon">
        options={[
          { key: "catalog", label: "Katalog" },
          { key: "soon", label: "Uskoro" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "catalog" ? (
        <>
          {!catalog && !failed ? <ActivityIndicator color={colors.ink2} style={{ marginTop: s(30) }} /> : null}
          {failed ? <Text style={styles.err}>Server nije dostupan.</Text> : null}
          <View style={styles.grid}>
            {catalog?.rewards.map((r, i) => (
              <NeoSurface key={r.id} radius={s(18)} style={styles.rcard}>
                <LinearGradient colors={THUMBS[i % THUMBS.length]!} style={styles.thumb} />
                <Text style={styles.rname}>{r.title}</Text>
                <Text style={styles.rvendor}>{r.vendor ?? "Beleg"}</Text>
                <View style={styles.rcost}>
                  <Text style={styles.rprice}>{r.pointsCost} p</Text>
                  {r.affordable ? (
                    <Pressable onPress={() => redeem(r.id, r.title)} disabled={busy === r.id} style={styles.take}>
                      {busy === r.id ? (
                        <ActivityIndicator size="small" color="#3E7D68" />
                      ) : (
                        <Text style={styles.takeText}>Uzmi</Text>
                      )}
                    </Pressable>
                  ) : (
                    <Text style={styles.rgoal}>još {r.remaining}</Text>
                  )}
                </View>
              </NeoSurface>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.soon}>
          <View style={styles.soonOrb}>
            <Aura size={s(150)} />
            <Ionicons name="gift" size={s(46)} color="#8B6FC0" />
          </View>
          <Text style={styles.soonTitle}>Uskoro — iznenađenje</Text>
          <Text style={styles.soonText}>
            Spremamo nešto posebno za tvoje skenirane račune. Nastavi da skupljaš poene — biće ti od koristi.
          </Text>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 999, paddingHorizontal: s(11), paddingVertical: s(5), backgroundColor: "#E7DCF7" },
  pillText: { fontFamily: fontFamily.heavy, fontSize: s(10.5), color: "#5A4470" },
  err: { fontFamily: fontFamily.bold, fontSize: s(12.5), color: "#A24E6C", textAlign: "center", marginTop: s(24) },
  take: { borderRadius: 999, paddingHorizontal: s(12), paddingVertical: s(5), backgroundColor: "#E4F6EC" },
  takeText: { fontFamily: fontFamily.heavy, fontSize: s(11), color: "#3E7D68" },
  filterText: { fontFamily: fontFamily.heavy, fontSize: s(12), color: colors.ink },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: s(12) },
  rcard: { width: "47%", padding: s(11) },
  star: { position: "absolute", top: s(8), right: s(8), width: s(28), height: s(28), borderRadius: s(14), backgroundColor: "rgba(255,255,255,0.7)", alignItems: "center", justifyContent: "center", zIndex: 2, borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" },
  starOn: { backgroundColor: "#F5B94E" },
  thumb: { height: s(62), borderRadius: s(12), marginBottom: s(9) },
  rname: { fontFamily: fontFamily.heavy, fontSize: s(12.5), color: colors.ink },
  rvendor: { fontFamily: fontFamily.bold, fontSize: s(10), color: colors.ink2, marginBottom: s(8) },
  rcost: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rprice: { fontFamily: fontFamily.heavy, fontSize: s(13.5), color: colors.ink },
  rgoal: { fontFamily: fontFamily.bold, fontSize: s(10), color: "#3E7D68" },
  soon: { alignItems: "center", justifyContent: "center", paddingTop: s(40), paddingHorizontal: s(20) },
  soonOrb: { width: s(150), height: s(150), alignItems: "center", justifyContent: "center", marginBottom: s(22) },
  soonTitle: { fontFamily: fontFamily.heavy, fontSize: s(20), color: colors.ink, marginBottom: s(10) },
  soonText: {
    fontFamily: fontFamily.regular,
    fontSize: s(13.5),
    color: colors.ink2,
    textAlign: "center",
    lineHeight: s(21),
    maxWidth: s(290),
  },
});
