import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Control, Controller, Noop } from "react-hook-form";
import { Animated, StyleProp, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const ActiveTop = 10;
const InactiveTop = 23;

export const InputText = ({ control, rules, name, label, style }: Props) => {
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [initialLabel, setInitialLabel] = useState<number>(InactiveTop);

  const [fontStart, setFontStart] = useState<number>(16);
  const [fontFinal, setFontFinal] = useState<number>(12);

  const theme = useTheme();
  const animatedFocus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedFocus, {
      toValue: isFocused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);


  const AnimatedStyle = {
    top: animatedFocus.interpolate({
      inputRange: [0, 1],
      outputRange: [initialLabel, ActiveTop],
    }),
    fontSize: animatedFocus.interpolate({
      inputRange: [0, 1],
      outputRange: [fontStart, fontFinal],
    }),
    color: animatedFocus.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.text70, theme.colors.primary],
    }),
  }

  const handleOnBlur = (action: Noop, value: string) => {
    console.log("Temvalor", !!value);

    if(!!value) { 
      setInitialLabel(ActiveTop);
      setFontStart(12);
      setFontFinal(12);
    }

    else {
      setInitialLabel(InactiveTop);
      setFontStart(16);
      setFontFinal(12);
    }

    setIsFocused(false);
    action();
  }

  return (
    <View style={styles.container}>
      <Animated.Text 
      style={[AnimatedStyle, styles.label]} 
      pointerEvents="none"
      >{label}</Animated.Text>
      <Controller
        control={control}
        rules={{ required: rules.required }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={() => handleOnBlur(onBlur, value)}
            onFocus={() => setIsFocused(true)}
            onChangeText={onChange}
            value={value}
            style={[style, styles.input]}
            secureTextEntry={hidePassword && rules.isPassword}
            keyboardType={getKeyBoardType(rules)}
            aria-label={label}
          />
        )}
        name={name}
      />
      {rules.isPassword && (
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          {hidePassword && <AntDesign name="eye" size={20}  color={'#FFFFFF60'}/>}
          {!hidePassword && <AntDesign name="eye-invisible" size={20}  color={'#FFFFFF60'}/>}
        </TouchableOpacity>
      )}
    </View>
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
};

type Props = {
  control: Control<any>;
  rules: Settings;
  name: string;
  label: string;
  style?: StyleProp<any>;
};
