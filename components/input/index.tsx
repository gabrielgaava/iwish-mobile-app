import i18n from "@/constants/region";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Control, Controller, useFormState } from "react-hook-form";
import { Animated, StyleProp, TouchableOpacity } from "react-native";
import {
  StyledContainer,
  StyledErrorText,
  StyledInput,
  StyledWrapper,
  styles,
} from "./styles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InputText = ({
  control,
  rules,
  name,
  label,
  style,
  error,
  disabled,
  leftIcon,
}: Props) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const theme = useTheme();
  const { errors } = useFormState({ control, name });

  // Refs para callbacks estáveis — evita criar novas arrow functions a cada render
  const onChangeRef = useRef<(text: string) => void>(() => {});
  const onBlurRef = useRef<() => void>(() => {});
  // Ref espelho de hasValue para evitar setState desnecessário na comparação
  const hasValueRef = useRef(false);

  const fieldError = errors[name]?.message as string | undefined;
  const displayError = error ?? fieldError;
  const hasError = !!displayError;
  const isDisabled = !!(disabled ?? rules.disabled);
  const isFilled = hasValue && !isFocused && !hasError && !isDisabled;

  // Criado uma única vez — sem nova interpolação a cada render
  const animatedShadow = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(
    animatedShadow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] })
  ).current;

  useEffect(() => {
    Animated.timing(animatedShadow, {
      toValue: isFocused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [animatedShadow, isFocused]);

  const borderColor = useMemo(() => {
    if (hasError) return theme.colors.errorText;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  }, [hasError, isFocused, theme.colors.errorText, theme.colors.primary, theme.colors.border]);

  const containerStyle = useMemo(() => ({
    borderColor,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: isFocused ? shadowOpacity : 0,
    shadowRadius: 8,
    elevation: isFocused ? 3 : 0,
  }), [borderColor, isFocused, shadowOpacity, theme.colors.primary]);

  const controllerRules = useMemo(() => ({
    required: rules.required ? i18n.t("required") : false,
    ...(rules.isEmail && {
      pattern: { value: EMAIL_REGEX, message: i18n.t("invalidEmail") },
    }),
    ...(rules.minLength && {
      minLength: {
        value: rules.minLength,
        message: `${i18n.t("min")} ${rules.minLength} ${i18n.t("characters")}`,
      },
    }),
    ...(rules.maxLength && {
      maxLength: {
        value: rules.maxLength,
        message: `${i18n.t("max")} ${rules.maxLength} ${i18n.t("characters")}`,
      },
    }),
    ...(rules.validate && { validate: rules.validate }),
  }), [rules.required, rules.isEmail, rules.minLength, rules.maxLength, rules.validate]);

  // Atualiza hasValue apenas na transição vazio ↔ preenchido, não a cada caractere
  const handleChangeText = useCallback((text: string) => {
    onChangeRef.current(text);
    const next = text.length > 0;
    if (next !== hasValueRef.current) {
      hasValueRef.current = next;
      setHasValue(next);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlurRef.current();
  }, []);

  const handleFocus = useCallback(() => {
    if (!isDisabled) setIsFocused(true);
  }, [isDisabled]);

  const togglePassword = useCallback(() => setHidePassword(p => !p), []);

  const leftIconEl = useMemo(() => {
    if (rules.isPassword) {
      return (
        <AntDesign name="lock" size={18} color={theme.colors.text50} style={styles.iconLeft} />
      );
    }
    if (leftIcon) {
      return (
        <Feather name={leftIcon} size={18} color={theme.colors.text50} style={styles.iconLeft} />
      );
    }
    return null;
  }, [rules.isPassword, leftIcon, theme.colors.text50]);

  const rightIconEl = useMemo(() => {
    if (isDisabled) {
      return (
        <AntDesign name="lock" size={18} color={theme.colors.text50} style={styles.iconRight} />
      );
    }
    if (hasError && !rules.isPassword) {
      return (
        <AntDesign name="exclamation-circle" size={18} color={theme.colors.errorText} style={styles.iconRight} />
      );
    }
    if (rules.isPassword) {
      return (
        <TouchableOpacity onPress={togglePassword} style={styles.iconRight}>
          <AntDesign
            name={hidePassword ? "eye" : "eye-invisible"}
            size={18}
            color={theme.colors.text50}
          />
        </TouchableOpacity>
      );
    }
    if (isFilled) {
      return (
        <AntDesign name="check-circle" size={18} color={theme.colors.primary} style={styles.iconRight} />
      );
    }
    return null;
  }, [isDisabled, hasError, rules.isPassword, isFilled, hidePassword, togglePassword, theme.colors]);

  return (
    <StyledWrapper>
      <StyledContainer
        style={[containerStyle]}
        isFocused={isFocused}
        hasError={hasError}
        isDisabled={isDisabled}
      >
        {leftIconEl}
        <Controller
          control={control}
          name={name}
          rules={controllerRules}
          render={({ field: { onChange, onBlur, value } }) => {
            // Sincroniza os refs com os handlers atuais do Controller
            onChangeRef.current = onChange;
            onBlurRef.current = onBlur;
            return (
              <StyledInput
                isFocused={isFocused}
                hasError={hasError}
                isDisabled={isDisabled}
                onChangeText={handleChangeText}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={value}
                style={style}
                secureTextEntry={hidePassword && rules.isPassword}
                keyboardType={getKeyBoardType(rules)}
                aria-label={label}
                autoCapitalize="none"
                placeholder={label}
                placeholderTextColor={theme.colors.text50}
                editable={!isDisabled}
              />
            );
          }}
        />
        {rightIconEl}
      </StyledContainer>
      {hasError && <StyledErrorText>{displayError}</StyledErrorText>}
    </StyledWrapper>
  );
};

const getKeyBoardType = (rules: Settings) => {
  if (rules.isEmail) return "email-address";
  if (rules.isPhone) return "phone-pad";
  if (rules.isNumber) return "numeric";
  return "default";
};

type Settings = {
  required: boolean;
  isPassword?: boolean;
  isEmail?: boolean;
  isPhone?: boolean;
  isNumber?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  validate?: Record<string, (value: string) => boolean | string>;
};

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type Props = {
  control: Control<any>;
  rules: Settings;
  name: string;
  label: string;
  style?: StyleProp<any>;
  error?: string;
  disabled?: boolean;
  leftIcon?: FeatherIconName;
};
