import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * SECURE STORAGE — SecureStore (nativo) / AsyncStorage (web)
 * Use apenas para dados sensíveis: tokens, sessão, credenciais.
 * Limite: ~2KB por item no iOS.
 */
export async function storageValue(key: string, value: any) {
  if (Platform.OS === "web") {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  }
  return await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function getValueFor(key: string) {
  try {
    if (Platform.OS === "web") {
      const result = await AsyncStorage.getItem(key);
      return result || null;
    }
    const result = await SecureStore.getItemAsync(key);
    return result || null;
  } catch (error) {
    console.error("Error fetching secure value for key:", key, error);
    return null;
  }
}

/**
 * APP STORAGE — AsyncStorage em todas as plataformas
 * Use para dados não-sensíveis: recentes, preferências, cache de UI.
 * Sem limite prático de tamanho.
 */
export async function setAppValue(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting app value for key:", key, error);
  }
}

export async function getAppValue(key: string) {
  try {
    const result = await AsyncStorage.getItem(key);
    return result || null;
  } catch (error) {
    console.error("Error fetching app value for key:", key, error);
    return null;
  }
}
