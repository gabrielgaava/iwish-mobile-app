import React, { useMemo } from "react";
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

import {
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_MARGIN_BOTTOM,
} from "@/components/custom-tab-bar";

/**
 * Drop-in replacement for ScrollView em telas com a floating tab bar.
 * Adiciona automaticamente o paddingBottom necessário para o conteúdo
 * não ficar escondido atrás da barra, somando ao paddingBottom existente.
 *
 * Pressupõe que a tela usa SafeAreaView (edges bottom), logo não inclui
 * insets.bottom novamente — apenas a altura da barra + margem.
 */

export const TAB_BAR_SCROLL_INSET =
  FLOATING_TAB_BAR_HEIGHT + FLOATING_TAB_BAR_MARGIN_BOTTOM;

type TabScrollViewProps = ScrollViewProps & {
  children?: React.ReactNode;
};

export function TabScrollView({
  contentContainerStyle,
  children,
  ...props
}: TabScrollViewProps) {
  const mergedContentContainerStyle = useMemo(() => {
    const flat = StyleSheet.flatten(contentContainerStyle) ?? {};
    const existingBottom =
      typeof flat.paddingBottom === "number" ? flat.paddingBottom : 0;
    return {
      ...flat,
      paddingBottom: existingBottom + TAB_BAR_SCROLL_INSET,
    };
  }, [contentContainerStyle]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={mergedContentContainerStyle}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
