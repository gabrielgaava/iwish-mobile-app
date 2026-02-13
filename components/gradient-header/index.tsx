// components/AnimatedHeader.tsx
import { CustomDarkTheme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

interface AnimatedHeaderProps {
  children?: React.ReactNode;
  height?: number;
  colors: typeof CustomDarkTheme.colors.primaryGradient;
}

export function GradientHeader({ children, height = 25, colors, }: AnimatedHeaderProps) {

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.container,
        { 
          minHeight:  screenHeight * (height / 100),
          flexBasis: screenHeight * (height / 100)
        }
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
