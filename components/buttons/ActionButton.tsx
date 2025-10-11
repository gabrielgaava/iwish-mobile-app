import { LinearGradient } from "expo-linear-gradient"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"

type ButtonProps = {
  onPress: () => void,
  text: string,
  disabled?: boolean,
  loading?: boolean,
}

export default function ActionButton(props: ButtonProps) {
  return (
    <TouchableOpacity 
      onPress={props.onPress} 
      disabled={props.disabled || props.loading} 
      style={styles.button}
    >
      <LinearGradient 
        colors={["#5a1ea3ff", "#4c6ef5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {props.loading && <ActivityIndicator color={'#fff'} />}
        {!props.loading && <Text style={styles.buttonText}>{props.text}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  )
}

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
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
  }
})