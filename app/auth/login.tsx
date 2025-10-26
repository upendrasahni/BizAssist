import React, { useContext, useMemo, useState } from "react";

import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { setUserContext } from "../services/userContext";
import { AuthContext } from "./context/AuthContext";
import styles from "./styles";

export default function LoginScreen() {
  const auth = useContext(AuthContext)!;
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fields = useMemo(
    () => [
      {
        key: "email",
        label: "Email",
        placeholder: "you@example.com",
        keyboardType: "email-address",
      },
      {
        key: "password",
        label: "Password",
        placeholder: "••••••••",
        secure: true,
      },
    ],
    []
  );

  const onChange = (k: string, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (!values.email || !values.password)
      return Alert.alert("Validation", "Please enter email and password.");
    setLoading(true);
    try {
      // Sign in with auth service
      const userInfo = await auth.signIn(values.email.trim(), values.password);

      // Store user context for Gemini
      await setUserContext({
        name: userInfo?.name || userInfo?.email?.split("@")[0] || "User",
        email: values.email.trim(),
        userId: userInfo?.id || Date.now().toString(),
        loginTime: new Date().toISOString(),
      });

      router.replace("/home/home");
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{item.label}</Text>
      <TextInput
        secureTextEntry={!!item.secure}
        keyboardType={item.keyboardType ?? "default"}
        placeholder={item.placeholder}
        placeholderTextColor="rgba(11,38,50,0.35)"
        value={(values as any)[item.key]}
        onChangeText={(t) => onChange(item.key, t)}
        style={styles.input}
        autoCapitalize={item.key === "email" ? "none" : "words"}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#0b66c3", "#06b6d4"]} style={styles.header}>
        <Text style={styles.headerTitle}>Welcome back</Text>
      </LinearGradient>

      <View style={styles.container}>
        <FlatList
          data={fields}
          keyExtractor={(i) => i.key}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>

        <View style={styles.rowInline}>
          <Text style={styles.muted}>New here?</Text>
          <TouchableOpacity onPress={() => router.replace("/auth/signup")}>
            <Text style={styles.link}> Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
