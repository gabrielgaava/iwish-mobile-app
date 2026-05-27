import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Txt } from "../ui/text";
import { OTPCodeInputProps } from "./OTPCodeInput";


export default function OTPCodeInput({ length = 6, error, onComplete, onChange }: OTPCodeInputProps) {

  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { colors } = useTheme();

  // um Animated.Value por caixa
  const animations = useRef(Array.from({ length }, () => new Animated.Value(0))).current;

   // 🔔 Dispara callback quando o código estiver completo
  useEffect(() => {
    animateFocus(code.length);
    if (code.length === length) {
      onComplete(code);
    }
  }, [code]);

  // 🧠 Atualiza o valor e filtra só números
  const handleChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    if (numeric.length <= length) {
      setCode(numeric);
      onChange?.(numeric);
    }
  };

    // função que anima a borda ativa
  const animateFocus = (index: number) => {
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  };

  // 🔲 Renderiza as caixinhas
  const boxes = Array.from({ length }).map((_, i) => {
    const borderColor = animations[i].interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border30, colors.primary],
    });

    const backgroundColor = animations[i].interpolate({
      inputRange: [0, 1],
      outputRange: [colors.darkBackground, colors.background],
    });

    const scale = animations[i].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.08],
    });

    const boxAnimationStyle = {
      borderColor,
      backgroundColor,
      transform: [{ scale }],
    };

    return (
      <Box key={i} style={[boxAnimationStyle]}>
        <Txt text={code[i] || ""} style={styles.digit} />
      </Box>
    );
    
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
    >
      {boxes}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        autoFocus
        style={styles.hiddenInput}
        maxLength={length}
      />
    </TouchableOpacity>
  );
}

const Box = styled(Animated.View)`
  width: 51px;
  height: 64px;
  border-width: 1.5px;
  border-color: ${p => p.theme.colors.darkBackground};
  background: ${p => p.theme.colors.darkBackground};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
  },
  digit: {
    fontSize: 22,
    fontWeight: "700",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
});