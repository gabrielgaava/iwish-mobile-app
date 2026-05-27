import Feather from "@expo/vector-icons/Feather";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import i18n from "@/constants/region";
import { useTheme } from "@react-navigation/native";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

const ICON_MAP: Record<string, FeatherName> = {
  "(home)": "home",
  search: "search",
  create: "plus-circle",
  profile: "user",
  settings: "settings",
};

const LABEL_KEYS: Record<string, string> = {
  "(home)": "tabs.home",
  search: "tabs.search",
  create: "tabs.create",
  profile: "tabs.profile",
  settings: "tabs.settings",
};

export const FLOATING_TAB_BAR_HEIGHT = 62;
export const FLOATING_TAB_BAR_MARGIN_BOTTOM = 12;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets();

  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const isFirstLayout = useRef(true);

  useEffect(() => {
    if (tabWidth === 0) return;

    if (isFirstLayout.current) {
      indicatorX.setValue(state.index * tabWidth);
      isFirstLayout.current = false;
      return;
    }

    Animated.spring(indicatorX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
      mass: 0.9,
    }).start();
  }, [state.index, tabWidth, indicatorX]);

  const handleBarLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width / state.routes.length;
      setTabWidth(w);
    },
    [state.routes.length]
  );

  const handlePress = useCallback(
    (key: string, name: string, params: object | undefined, isFocused: boolean) => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const event = navigation.emit({
        type: "tabPress",
        target: key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return;
      }

      if (isFocused) {
        navigation.navigate(name, {screen: "index"});
        return;
      }

      navigation.navigate(name, params);
    },
    [navigation]
  );

  const handleLongPress = useCallback(
    (key: string) => {
      navigation.emit({ type: "tabLongPress", target: key });
    },
    [navigation]
  );

  const barStyle = useMemo(
    () => [
      styles.bar,
      {
        bottom: insets.bottom + FLOATING_TAB_BAR_MARGIN_BOTTOM,
        backgroundColor: colors.tabBarBackground,
        borderColor: colors.border,
        shadowColor: colors.black,
      },
    ],
    [insets.bottom, colors]
  );

  // Gradiente cobre da base da tela até acima da barra
  const gradientStyle = useMemo(
    () => [
      styles.gradient,
      { height: insets.bottom + FLOATING_TAB_BAR_MARGIN_BOTTOM + FLOATING_TAB_BAR_HEIGHT + 24 },
    ],
    [insets.bottom]
  );

  const pillStyle = useMemo(
    () => [
      styles.pill,
      {
        width: tabWidth,
        backgroundColor: colors.primary + "1A",
        transform: [{ translateX: indicatorX }],
      },
    ],
    [tabWidth, colors.primary, indicatorX]
  );

  const gradientColors = useMemo(
    () => [colors.screenBackground + "00", colors.screenBackground] as [string, string],
    [colors]
  );

  return (
    <>
      {/* 1. Gradiente — renderiza primeiro (z menor), colado na base da tela */}
      <LinearGradient
        colors={gradientColors}
        style={gradientStyle}
        pointerEvents="none"
      />

      {/* 2. Barra — renderiza depois (z maior), flutua por cima do gradiente */}
      <View style={barStyle}>
        {tabWidth > 0 && <Animated.View style={pillStyle} />}
        <View style={styles.row} onLayout={handleBarLayout}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = ICON_MAP[route.name] ?? "circle";
            const label = i18n.t(LABEL_KEYS[route.name] ?? "tabs.home");
            const { options } = descriptors[route.key];

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={() => handlePress(route.key, route.name, route.params, isFocused)}
                onLongPress={() => handleLongPress(route.key)}
                style={styles.tabButton}
              >
                <Feather
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.primary : colors.tabIconDefault}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.primary : colors.text70 },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Colado na base da tela, cobre a área sob a barra (bottom dinâmico via gradientStyle)
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Barra flutuante (bottom dinâmico via barStyle)
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 24,
    borderWidth: 0.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  pill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    gap: 3,
    minHeight: FLOATING_TAB_BAR_HEIGHT,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
