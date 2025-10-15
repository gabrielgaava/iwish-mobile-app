import { StyleProp, StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../ui/text";

type LinkButtonProps = {
  text: string,
  textAlign: "auto" | "left" | "right" | "center" | "justify" | undefined,
  style?: StyleProp<any>;
  onPress: () => void,
}

export default function LinkButton(props: LinkButtonProps) {
  return (
    <TouchableOpacity 
      onPress={props.onPress}
      activeOpacity={0.9} 
      style={[style.linkTouch, props.style]}
     >
      <Txt style={{ textAlign: props.textAlign }} text={props.text} />
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  linkTouch: {
    marginVertical: 10,
    opacity: 0.5,
  }
})