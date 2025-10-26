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

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { AuthContext } from "./context/AuthContext";
import styles from "./styles";

export default function SignUpScreen() {
  const auth = useContext(AuthContext)!;
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fields = useMemo(
    () => [
      { key: "name", label: "Full name", placeholder: "John Doe" },
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
      {
        key: "confirm",
        label: "Confirm password",
        placeholder: "••••••••",
        secure: true,
      },
    ],
    []
  );

  const onChange = (key: string, text: string) =>
    setValues((s) => ({ ...s, [key]: text }));

  const submit = async () => {
    if (!values.name.trim() || !values.email.trim() || !values.password) {
      return Alert.alert("Validation", "Please fill all fields.");
    }
    if (values.password !== values.confirm) {
      return Alert.alert("Validation", "Passwords do not match.");
    }
    setSubmitting(true);
    try {
      // Sign up with the user's full name included
      await auth.signUp(
        values.name.trim(),
        values.email.trim(),
        values.password
      );

      Alert.alert(
        "Success",
        `Welcome ${values.name}! Your account has been created. Please log in.`,
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (e: any) {
      Alert.alert("Sign up failed", e.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const secure = !!item.secure;
    const keyboardType: any = item.keyboardType ?? "default";
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{item.label}</Text>
        <TextInput
          autoCapitalize={item.key === "email" ? "none" : "words"}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          placeholder={item.placeholder}
          placeholderTextColor="rgba(11,38,50,0.35)"
          value={(values as any)[item.key]}
          onChangeText={(t) => onChange(item.key, t)}
          style={styles.input}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#0b66c3", "#06b6d4"]} style={styles.header}>
        <Text style={styles.headerTitle}>Create account</Text>
      </LinearGradient>

      <View style={styles.container}>
        <FlatList
          data={fields}
          keyExtractor={(i) => i.key}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          scrollEnabled={false}
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={submit}
          disabled={submitting}
        >
          <Text style={styles.primaryBtnText}>
            {submitting ? "Creating..." : "Sign up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.rowInline}>
          <Text style={styles.muted}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("/auth/login")}>
            <Text style={styles.link}> Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
