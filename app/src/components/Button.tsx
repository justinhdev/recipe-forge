import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#ffffff" : "#334155"}
        />
      ) : (
        <Text
          style={[styles.label, variant === "primary" && styles.primaryLabel]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  danger: {
    backgroundColor: "#fee2e2",
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.82,
  },
  primary: {
    backgroundColor: "#2563eb",
  },
  primaryLabel: {
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: "#e2e8f0",
  },
});
