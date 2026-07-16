import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, Manrope_500Medium, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { ScannerScreen } from "./src/screens/ScannerScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { WalletScreen } from "./src/screens/WalletScreen";
import { RewardsScreen } from "./src/screens/RewardsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import type { DockTab } from "./src/components/Dock";
import { colors, fontFamily } from "./src/theme";

type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Scanner: undefined;
  Result: undefined;
  Home: undefined;
  Wallet: undefined;
  Rewards: undefined;
  Profile: undefined;
  Placeholder: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type Nav = NativeStackNavigationProp<RootStackParamList>;

// Shared dock navigation: tabs jump to their screen, Scan opens the scanner.
function dockNav(navigation: Nav) {
  return (tab: DockTab) => {
    if (tab === "Scan") navigation.navigate("Scanner");
    else navigation.navigate(tab);
  };
}

function Placeholder({ route }: NativeStackScreenProps<RootStackParamList, "Placeholder">) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{route.params.name}</Text>
      <Text style={styles.placeholderHint}>Ekran u izradi</Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Manrope_500Medium, Manrope_700Bold, Manrope_800ExtraBold });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: "fade" }}
        >
          <Stack.Screen name="Onboarding">
            {({ navigation }) => (
              <OnboardingScreen
                onScan={() => navigation.navigate("Scanner")}
                onSignIn={() => navigation.navigate("Auth")}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Auth">
            {({ navigation }) => (
              <AuthScreen onSubmit={() => navigation.navigate("Home")} onBack={() => navigation.goBack()} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Scanner" options={{ presentation: "fullScreenModal" }}>
            {({ navigation }) => (
              <ScannerScreen onClose={() => navigation.goBack()} onScanned={() => navigation.replace("Result")} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Result">
            {({ navigation }) => (
              <ResultScreen
                state="SUCCESS"
                onContinue={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Home">
            {({ navigation }) => <HomeScreen onNavigate={dockNav(navigation)} />}
          </Stack.Screen>
          <Stack.Screen name="Wallet">
            {({ navigation }) => <WalletScreen onNavigate={dockNav(navigation)} />}
          </Stack.Screen>
          <Stack.Screen name="Rewards">
            {({ navigation }) => <RewardsScreen onNavigate={dockNav(navigation)} />}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {({ navigation }) => <ProfileScreen onNavigate={dockNav(navigation)} />}
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
