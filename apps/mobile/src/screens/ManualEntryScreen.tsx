import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassButton } from "../components/GlassButton";
import { NeoSurface } from "../components/NeoSurface";
import { isLikelyInvoiceNumber, ManualReceiptEntry } from "@beleg/shared-types";
import { colors, fontFamily, s } from "../theme";

/**
 * Manual entry fallback (FR-3), for receipts whose QR won't scan — faded
 * thermal print, torn corner, dense code.
 *
 * The fields mirror the tax authority's own verification form
 * (suf.purs.gov.rs/verify). That form is reCAPTCHA-protected, so we cannot
 * verify these automatically: the receipt goes to manual review (FR-4) and
 * points are granted only once a moderator confirms it.
 */
export function ManualEntryScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (entry: ManualReceiptEntry) => void;
}) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceCounter, setInvoiceCounter] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [sdcDateTime, setSdcDateTime] = useState("");
  const [touched, setTouched] = useState(false);

  const numberOk = isLikelyInvoiceNumber(invoiceNumber);
  const canSubmit = numberOk && totalAmount.trim().length > 0 && sdcDateTime.trim().length > 0;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({
      invoiceNumber: invoiceNumber.trim(),
      invoiceCounter: invoiceCounter.trim(),
      totalAmount: totalAmount.trim(),
      sdcDateTime: sdcDateTime.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.back} accessibilityLabel="Nazad">
            <Ionicons name="chevron-back" size={s(22)} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Unesi ručno</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.lead}>
            Ako QR ne može da se pročita, prepiši podatke sa dna računa.
          </Text>

          <Field
            label="ПФР број рачуна"
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="92PY9LTA-92PY9LTA-5425"
            autoCapitalize="characters"
            error={touched && !numberOk ? "Proveri format broja." : undefined}
          />
          <Field
            label="Бројач рачуна"
            value={invoiceCounter}
            onChangeText={setInvoiceCounter}
            placeholder="5400/5425ПП"
          />
          <Field
            label="Укупан износ"
            value={totalAmount}
            onChangeText={setTotalAmount}
            placeholder="3530,00"
            keyboardType="decimal-pad"
            error={touched && !totalAmount.trim() ? "Obavezno." : undefined}
          />
          <Field
            label="ПФР време"
            value={sdcDateTime}
            onChangeText={setSdcDateTime}
            placeholder="16.07.2026 14:43:27"
            error={touched && !sdcDateTime.trim() ? "Obavezno." : undefined}
          />

          <NeoSurface radius={s(14)} style={styles.note}>
            <Ionicons name="information-circle-outline" size={s(16)} color="#8B6FC0" />
            <Text style={styles.noteText}>
              Ručno unet račun ide na proveru — poeni stižu kada ga potvrdimo. Skeniranje QR koda je odmah.
            </Text>
          </NeoSurface>
        </ScrollView>

        <View style={styles.foot}>
          <GlassButton label="Pošalji na proveru" onPress={submit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  error,
  ...input
}: React.ComponentProps<typeof TextInput> & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...input}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.ink2}
        autoCorrect={false}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: s(6), paddingHorizontal: s(12), paddingTop: s(6) },
  back: { width: s(38), height: s(38), alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fontFamily.heavy, fontSize: s(20), color: colors.ink },
  body: { paddingHorizontal: s(18), paddingTop: s(10), paddingBottom: s(20) },
  lead: { fontFamily: fontFamily.regular, fontSize: s(13), color: colors.ink2, lineHeight: s(20), marginBottom: s(18) },
  field: { marginBottom: s(14) },
  fieldLabel: {
    fontFamily: fontFamily.bold,
    fontSize: s(10),
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.ink2,
    marginBottom: s(6),
  },
  input: {
    borderRadius: s(14),
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.track,
    paddingVertical: s(14),
    paddingHorizontal: s(14),
    fontFamily: fontFamily.bold,
    fontSize: s(15),
    color: colors.ink,
  },
  inputError: { borderColor: "#E89AB0" },
  fieldError: { fontFamily: fontFamily.bold, fontSize: s(11), color: "#A24E6C", marginTop: s(5) },
  note: { flexDirection: "row", gap: s(9), alignItems: "flex-start", padding: s(13), marginTop: s(4) },
  noteText: { flex: 1, fontFamily: fontFamily.regular, fontSize: s(11.5), color: colors.ink2, lineHeight: s(17) },
  foot: { paddingHorizontal: s(18), paddingBottom: s(14) },
});
