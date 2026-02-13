import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function storageValue(key: string, value: any) {
  if(Platform.OS === "web") {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  } 
  
  return await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function getValueFor(key: string) {
  try {
    if(Platform.OS === "web") {
      let result = await AsyncStorage.getItem(key);
      return result || null;
    }

    let result = await SecureStore.getItemAsync(key);
    return result || null;
  }

  catch (error) {
    console.error("Error fetching value for key: ", key, error);
    return null;
  }
}