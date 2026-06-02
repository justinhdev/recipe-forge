import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../src/auth/AuthContext";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/today" : "/login"} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    flex: 1,
    justifyContent: "center",
  },
});
