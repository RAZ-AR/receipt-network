import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions, scanFromURLAsync } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Dock, DockTab } from "../components/Dock";
import { GlassButton } from "../components/GlassButton";
import { isFiscalReceiptUrl } from "../api/taxcore";
import { colors, fontFamily, s, DOCK_CLEARANCE } from "../theme";

/**
 * QR-first scanner (ADR-P-013): the camera opens straight away and looks for
 * the fiscal QR. A non-fiscal code is rejected inline rather than sent on.
 */
export function ScannerScreen({
  onClose,
  onScanned,
  onNavigate,
}: {
  onClose: () => void;
  onScanned: (url: string) => void;
  onNavigate: (tab: DockTab) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [seen, setSeen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const camera = useRef<CameraView>(null);
  // Barcodes fire continuously — only act on the first valid one.
  const handled = useRef(false);

  const accept = (data: string) => {
    handled.current = true;
    onScanned(data);
  };

  const reject = (data: string) => {
    // Show what was actually read: a rejected code is otherwise a silent
    // dead end, and the raw value is what tells us why.
    setSeen(data.slice(0, 90));
    setHint("Ovo nije fiskalni QR kod sa računa.");
  };

  // Fast path: the live preview stream decodes simple codes instantly.
  const onBarcode = ({ data }: { data: string }) => {
    if (handled.current || busy) return;
    if (!isFiscalReceiptUrl(data)) return reject(data);
    accept(data);
  };

  /**
   * Reliable path for the fiscal QR. It carries ~700 chars, so it is a very
   * high-density code — the live preview runs at too low a resolution to
   * resolve its modules. A full-resolution still does decode it.
   */
  const captureAndScan = async () => {
    if (handled.current || busy) return;
    setBusy(true);
    setHint("Čitamo kod sa fotografije…");
    try {
      const photo = await camera.current?.takePictureAsync({ quality: 1, shutterSound: false });
      if (!photo?.uri) throw new Error("no photo");
      const found = await scanFromURLAsync(photo.uri, ["qr"]);
      const hit = found.find((r) => isFiscalReceiptUrl(r.data));
      if (hit) return accept(hit.data);
      if (found.length > 0) return reject(found[0]!.data);
      setHint("Nismo našli QR na fotografiji. Priđi bliže, tako da kod popuni okvir.");
    } catch {
      setHint("Nije uspelo čitanje. Pokušaj ponovo.");
    } finally {
      setBusy(false);
    }
  };

  if (!permission) return <View style={styles.root} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permWrap}>
        <Ionicons name="camera-outline" size={s(46)} color={colors.ink2} />
        <Text style={styles.permTitle}>Potreban je pristup kameri</Text>
        <Text style={styles.permText}>Beleg koristi kameru samo da pročita QR kod sa računa.</Text>
        <View style={styles.permBtn}>
          <GlassButton label="Dozvoli kameru" onPress={requestPermission} />
        </View>
        <Pressable onPress={onClose}>
          <Text style={styles.permBack}>Nazad</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing="back"
        mode="picture"
        // expo-camera defaults autofocus to "off" on iOS. A fiscal QR carries
        // ~700 chars, so it is dense: without focus the preview looks fine to
        // the eye but never resolves sharply enough to decode.
        autofocus="on"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={onBarcode}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.top}>
          <Pressable onPress={onClose} style={styles.iconBtn} accessibilityLabel="Zatvori">
            <Ionicons name="close" size={s(20)} color="#fff" />
          </Pressable>
          <Text style={styles.title}>Skeniraj QR sa računa</Text>
          <Pressable onPress={() => setTorch((t) => !t)} style={styles.iconBtn} accessibilityLabel="Baterijska lampa">
            <Ionicons name={torch ? "flash" : "flash-off"} size={s(20)} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.frameArea} pointerEvents="none">
          <View style={styles.frame}>
            <Corner style={styles.tl} />
            <Corner style={styles.tr} />
            <Corner style={styles.bl} />
            <Corner style={styles.br} />
          </View>
          <Text style={styles.hint}>
            {hint ?? "Uperi kameru u fiskalni QR — Beleg ga proverava kod TaxCore za par sekundi."}
          </Text>
          {seen ? (
            <View style={styles.seenBox}>
              <Text style={styles.seenLabel}>Pročitano</Text>
              <Text style={styles.seenText} numberOfLines={3}>
                {seen}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.shutterRow}>
          <Pressable onPress={captureAndScan} disabled={busy} accessibilityLabel="Slikaj kod">
            <View style={[styles.shutter, busy && styles.shutterBusy]}>
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="camera" size={s(28)} color="#fff" />
              )}
            </View>
          </Pressable>
          <Text style={styles.shutterHint}>Ne prepoznaje sam? Slikaj kod</Text>
        </View>
      </SafeAreaView>

      <Dock onNavigate={onNavigate} />
    </View>
  );
}

function Corner({ style }: { style: StyleProp<ViewStyle> }) {
  return <View style={[styles.corner, style]} />;
}

const FRAME = s(230);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0E1116" },
  overlay: { flex: 1, justifyContent: "flex-start" },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: s(16) },
  iconBtn: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: fontFamily.bold, fontSize: s(13), color: "#fff" },
  frameArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  frame: { width: FRAME, height: FRAME },
  corner: { position: "absolute", width: s(38), height: s(38), borderColor: "#8FD0F5" },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: s(16) },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: s(16) },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: s(16) },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: s(16) },
  hint: {
    fontFamily: fontFamily.bold,
    fontSize: s(12.5),
    color: "#fff",
    textAlign: "center",
    marginTop: s(22),
    paddingHorizontal: s(34),
    lineHeight: s(19),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 6,
  },
  shutterRow: { alignItems: "center", paddingBottom: DOCK_CLEARANCE, gap: s(8) },
  shutter: {
    width: s(66),
    height: s(66),
    borderRadius: s(33),
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBusy: { opacity: 0.6 },
  shutterHint: {
    fontFamily: fontFamily.bold,
    fontSize: s(11),
    color: "rgba(255,255,255,0.9)",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 5,
  },
  seenBox: {
    marginTop: s(12),
    marginHorizontal: s(24),
    paddingVertical: s(9),
    paddingHorizontal: s(12),
    borderRadius: s(12),
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  seenLabel: {
    fontFamily: fontFamily.bold,
    fontSize: s(9),
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
    marginBottom: s(3),
  },
  seenText: { fontFamily: fontFamily.regular, fontSize: s(10.5), color: "#fff" },
  permWrap: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", padding: s(28), gap: s(10) },
  permTitle: { fontFamily: fontFamily.heavy, fontSize: s(19), color: colors.ink, marginTop: s(8) },
  permText: { fontFamily: fontFamily.regular, fontSize: s(13), color: colors.ink2, textAlign: "center", lineHeight: s(20) },
  permBtn: { alignSelf: "stretch", marginTop: s(10) },
  permBack: { fontFamily: fontFamily.bold, fontSize: s(13), color: colors.ink2, padding: s(12) },
});
