import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, Manrope_500Medium, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import type { DockTab } from "./src/components/Dock";
import { colors, fontFamily } from "./src/theme";

// Sprint-1 slice: Onboarding + Home are real; the rest are placeholders that
// the next screens replace one by one (see src/screens/index.ts registry).
type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Placeholder: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Placeholder({ route }: NativeStackScreenProps<RootStackParamList, "Placeholder">) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{route.params.name}</Text>
      <Text style={styles.placeholderHint}>Ekran u izradi</Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
        >
          <Stack.Screen name="Onboarding">
            {({ navigation }) => (
              <OnboardingScreen
                onScan={() => navigation.navigate("Placeholder", { name: "Skener" })}
                onSignIn={() => navigation.navigate("Placeholder", { name: "Prijava" })}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <HomeScreen
                onNavigate={(tab: DockTab) =>
                  tab === "Home"
                    ? undefined
                    : navigation.navigate("Placeholder", { name: tab })
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Placeholder" component={Placeholder} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  placeholderText: { fontFamily: fontFamily.heavy, fontSize: 22, color: colors.ink },
  placeholderHint: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.ink2, marginTop: 6 },
});
