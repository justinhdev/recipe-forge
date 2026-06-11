import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ApiError } from "../src/api/client";
import { useAuth } from "../src/auth/AuthContext";
import { Button } from "../src/components/Button";

export default function LoginScreen() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/today");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/today" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      <View style={styles.panel}>
        <Text style={styles.title}>Recipe Forge</Text>
        <Text style={styles.subtitle}>Sign in to track today's food.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            style={styles.input}
            value={email}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          disabled={!email || !password}
          label="Sign in"
          loading={isSubmitting}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0f172a",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  panel: {
    gap: 18,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    color: "#0f172a",
    fontSize: 32,
    fontWeight: "800",
  },
});
