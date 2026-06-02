import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "recipe-forge.jwt";

export async function getStoredToken() {
  if (Platform.OS === "web") {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token: string) {
  if (Platform.OS === "web") {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearStoredToken() {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
