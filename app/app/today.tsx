import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Redirect, router } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { deleteFoodLog, getDailyTarget, getFoodLogs } from "../src/api/client";
import { useAuth } from "../src/auth/AuthContext";
import { Button } from "../src/components/Button";
import { formatLocalDate } from "../src/utils/date";
import { sumFoodLogs } from "../src/utils/nutrition";

export default function TodayScreen() {
  const { isAuthenticated, isLoading: isAuthLoading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const today = formatLocalDate();
  const logsQuery = useQuery({
    queryKey: ["foodLogs", today],
    queryFn: () => getFoodLogs(today),
    enabled: isAuthenticated,
  });
  const targetQuery = useQuery({
    queryKey: ["dailyTarget"],
    queryFn: getDailyTarget,
    enabled: isAuthenticated,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteFoodLog,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["foodLogs", today] }),
  });

  const logs = logsQuery.data ?? [];
  const target = targetQuery.data ?? null;
  const totals = useMemo(() => sumFoodLogs(logs), [logs]);

  async function handleSignOut() {
    await signOut();
    queryClient.clear();
    router.replace("/login");
  }

  if (isAuthLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (logsQuery.isLoading || targetQuery.isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>{today}</Text>
          <Text style={styles.title}>Today's food</Text>
        </View>
        <Button label="Log out" onPress={handleSignOut} variant="secondary" />
      </View>

      {logsQuery.error || targetQuery.error ? (
        <Text style={styles.error}>
          Could not load today's data. Pull to refresh and try again.
        </Text>
      ) : null}

      <View style={styles.summary}>
        <MacroRow
          current={totals.calories}
          label="Calories"
          target={target?.calories ?? 0}
        />
        <MacroRow
          current={totals.protein}
          label="Protein"
          target={target?.protein ?? 0}
          unit="g"
        />
        <MacroRow
          current={totals.carbs}
          label="Carbs"
          target={target?.carbs ?? 0}
          unit="g"
        />
        <MacroRow
          current={totals.fat}
          label="Fat"
          target={target?.fat ?? 0}
          unit="g"
        />
        {!target ? (
          <Text style={styles.muted}>No daily target has been set yet.</Text>
        ) : null}
      </View>

      <Link href="/add-log" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Add food</Text>
        </Pressable>
      </Link>

      <FlatList
        contentContainerStyle={logs.length ? styles.list : styles.emptyList}
        data={logs}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptyText}>
              Add a manual entry to start tracking today.
            </Text>
          </View>
        }
        onRefresh={() => {
          logsQuery.refetch();
          targetQuery.refetch();
        }}
        refreshing={logsQuery.isRefetching || targetQuery.isRefetching}
        renderItem={({ item }) => (
          <View style={styles.logRow}>
            <View style={styles.logMain}>
              <Text style={styles.logName}>{item.name}</Text>
              <Text style={styles.logMacros}>
                {item.protein}g P | {item.carbs}g C | {item.fat}g F
              </Text>
            </View>
            <View style={styles.logSide}>
              <Text style={styles.logCalories}>{item.calories}</Text>
              <Text style={styles.logCaloriesLabel}>cal</Text>
              <Pressable
                accessibilityRole="button"
                disabled={deleteMutation.isPending}
                onPress={() => deleteMutation.mutate(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

function MacroRow({
  current,
  label,
  target,
  unit = "",
}: {
  current: number;
  label: string;
  target: number;
  unit?: string;
}) {
  const progress = target > 0 ? Math.min(current / target, 1) : 0;
  const progressWidth = `${Math.round(progress * 100)}%` as `${number}%`;

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroTextRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {current}
          {unit} / {target || "-"}
          {target ? unit : ""}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
    gap: 16,
    padding: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
  deleteText: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    padding: 24,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
  },
  emptyTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
  },
  eyebrow: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  list: {
    gap: 10,
    paddingBottom: 24,
  },
  loading: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    flex: 1,
    justifyContent: "center",
  },
  logCalories: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "right",
  },
  logCaloriesLabel: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "right",
  },
  logMacros: {
    color: "#64748b",
    fontSize: 14,
  },
  logMain: {
    flex: 1,
    gap: 6,
  },
  logName: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
  },
  logRow: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  logSide: {
    alignItems: "flex-end",
    minWidth: 76,
  },
  macroLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  macroRow: {
    gap: 8,
  },
  macroTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },
  muted: {
    color: "#64748b",
    fontSize: 14,
  },
  progressFill: {
    backgroundColor: "#2563eb",
    borderRadius: 999,
    height: "100%",
  },
  progressTrack: {
    backgroundColor: "#e2e8f0",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  summary: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "900",
  },
});
