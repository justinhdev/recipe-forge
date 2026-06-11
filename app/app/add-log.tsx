import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ApiError, createFoodLog } from "../src/api/client";
import { useAuth } from "../src/auth/AuthContext";
import { Button } from "../src/components/Button";
import { formatLocalDate } from "../src/utils/date";

type FoodForm = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

const initialForm: FoodForm = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

const isValidMacroInput = (value: string) => {
  const trimmed = value.trim();
  const parsed = Number(trimmed);

  return (
    trimmed.length > 0 &&
    Number.isFinite(parsed) &&
    parsed >= 0 &&
    parsed <= 10000
  );
};

export default function AddLogScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const today = formatLocalDate();

  const mutation = useMutation({
    mutationFn: createFoodLog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["foodLogs", today] });
      router.replace("/today");
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Unable to add food.");
    },
  });

  const canSubmit =
    form.name.trim().length > 0 &&
    [form.calories, form.protein, form.carbs, form.fat].every(
      isValidMacroInput
    );

  const updateField = (field: keyof FoodForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    setError(null);
    mutation.mutate({
      name: form.name.trim(),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
      loggedAt: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.label}>Food name</Text>
          <TextInput
            autoCapitalize="words"
            onChangeText={(value) => updateField("name", value)}
            placeholder="Greek yogurt"
            style={styles.input}
            value={form.name}
          />
        </View>

        <NumberField
          label="Calories"
          onChangeText={(value) => updateField("calories", value)}
          value={form.calories}
        />

        <View style={styles.macroGrid}>
          <NumberField
            label="Protein"
            onChangeText={(value) => updateField("protein", value)}
            value={form.protein}
          />
          <NumberField
            label="Carbs"
            onChangeText={(value) => updateField("carbs", value)}
            value={form.carbs}
          />
          <NumberField
            label="Fat"
            onChangeText={(value) => updateField("fat", value)}
            value={form.fat}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          disabled={!canSubmit}
          label="Save food"
          loading={mutation.isPending}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function NumberField({
  label,
  onChangeText,
  value,
}: {
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={onChangeText}
        placeholder="0"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 16,
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    flex: 1,
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
  loading: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    flex: 1,
    justifyContent: "center",
  },
  macroGrid: {
    gap: 14,
  },
});
