import { useTheme } from "@react-navigation/native";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../ui/text";

type LinkButtonProps = {
  text: string,
  textAlign?: "auto" | "left" | "right" | "center" | "justify" | undefined,
  style?: StyleProp<any>;
  contrast?: boolean,
  onPress: () => void,
  icon?: ReactNode;
}

export default function LinkButton(props: LinkButtonProps) {

  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      onPress={props.onPress}
      activeOpacity={0.7} 
      style={[style.linkTouch, props.style]}
     >
      {props.icon && props.icon}
      <Txt 
      style={{ 
        textAlign: props.textAlign || "center",
        color: props?.contrast ? colors.primary : colors.text70 
      }} 
      weight="regular"
      text={props.text} 
      />
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  linkTouch: {
    marginVertical: 10,
    opacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  }
})