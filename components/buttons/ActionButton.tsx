import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ColorValue, StyleSheet, TouchableOpacity } from 'react-native';
import { Txt } from "../ui/text";

type ButtonProps = {
  onPress: () => void,
  text: string,
  disabled?: boolean,
  loading?: boolean,
  duotone?: boolean,
}

export default function ActionButton(props: ButtonProps) {

  const theme = useTheme();

  const bgColor:[ColorValue, ColorValue, ...ColorValue[]] = props.duotone 
  ? [theme.colors.duotoneBackground, theme.colors.duotoneBackground]
  :  theme.colors.primaryGradient

  const textColor = props.duotone 
  ?  theme.colors.primary
  : theme.colors.text;

  const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 60,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: textColor,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
  }
})

  return (
    <TouchableOpacity 
      onPress={props.onPress} 
      disabled={props.disabled || props.loading} 
      style={styles.button}
    >
      <LinearGradient 
        colors={bgColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {props.loading && <ActivityIndicator color={textColor} />}
        {!props.loading && <Txt style={styles.buttonText} text={props.text} />}
      </LinearGradient>
    </TouchableOpacity>
  )
}