import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const ScrollScreen = ({ children }: { children: React.ReactNode }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <StyledSafeArea>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            {children}
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </StyledSafeArea>
  );
};

const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.screenBackground};
`;

const Container = styled.View`
  flex: 1;
`;
