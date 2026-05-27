/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ColorValue, Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    primaryGradient: ["#4c6ef5", "#5a1ea3ff"] as [ColorValue, ColorValue, ...ColorValue[]],
    duotoneBackground: "#ECECFC",
    defaultBorder: "#00000020",
    text: '#11181C',
    text70: '#11181C90',
    text50: '#11181C60',
    textContrast: '#000000',
    background: '#ffffff',
    altBackground: '#eeeeee',
    darkBackground: '#F9F9FF',
    glassBackground: '#ffffff20',
    screenBackground: "#FFFfff",
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    black: "#000000",
    white: "#FFFfff",
    white70: '#ffffff70',
    accent: "#F5B731",
    errorText: '#93000A',
    warningText: "#2b39ff",
    successText: "#0d8b41",
    errorBg: '#E75C5C29',
    errorBgSolid: '#FFA8A8',
    border30: "#C2C6D630",
    star: "#FFDA00",
    primary: "#4c6ef5",
    tabBarBackground: '#ffffff',
  },
  dark: {
    primaryGradient: ["#4c6ef5", "#5a1ea3ff"] as [ColorValue, ColorValue, ...ColorValue[]],
    duotoneBackground: "#18182f",
    defaultBorder: "#ffffff20",
    text: '#ECEDEE',
    text70: '#ECEDEE90',
    text50: '#ECEDEE60',
    textContrast: '#FFFFFF',
    darkBackground: '#0a0b0b',
    background: '#151718',
    altBackground: '#222222',
    glassBackground: '#00000020',
    screenBackground: "#151718",
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    black: "#000000",
    white: "#FFFFFF",
    white70: '#ffffff70',
    accent: "#F5B731",
    errorText: '#E75C5C',
    warningText: "#2b39ff",
    successText: "#0d8b41",
    errorBg: '#E75C5C4D',
    errorBgSolid: '#FFA8A8',
    border30: "#C2C6D630",
    star: "#FFDA00",
    primary: "#4c6ef5",
    tabBarBackground: '#222222'
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'PlusJakartaSans_400Regular, system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'PlusJakartaSans_400Regular, normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "PlusJakartaSans_400Regular, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...Colors.dark,
  } 
}

export const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light
  },
}