import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

type ScrollScreenProps = {
  children: React.ReactNode;
  indicator: boolean;
  grow?: boolean;
  /** Padding extra no rodapé — use TAB_BAR_SCROLL_INSET em telas dentro de tabs */
  bottomSpacing?: number;
  refreshControl?: React.ReactElement;
};

export const ScrollScreen = ({
  children,
  indicator = false,
  grow = true,
  bottomSpacing = 0,
  refreshControl,
}: ScrollScreenProps) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const minHeight = height - insets.top - insets.bottom;

  return (
    <StyledSafeArea>
      <KeyboardAvoidingView
        style={{ flex: grow ? 1 : undefined }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            minHeight,
            paddingBottom: bottomSpacing,
          }}
          showsVerticalScrollIndicator={indicator}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </StyledSafeArea>
  );
};

const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.screenBackground};
`;
