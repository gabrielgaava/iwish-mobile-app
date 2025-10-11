import { TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";

type LinkButtonProps = {
  text: string,
  onPress: () => void,
}

export default function LinkButton(props: LinkButtonProps) {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.9}>
      <ThemedText>{props.text}</ThemedText>
    </TouchableOpacity>
  )
}