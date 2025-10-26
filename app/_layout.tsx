import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { enableScreens } from "react-native-screens";
import { AuthProvider } from "./auth/context/AuthContext";

enableScreens();

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack
          initialRouteName="auth/login"
          screenOptions={{
            contentStyle: { backgroundColor: "#f6f9fb" },
          }}
        >
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="home/home" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
