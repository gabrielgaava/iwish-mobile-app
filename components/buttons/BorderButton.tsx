import { ReactNode } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type ButtonProps = {
  onPress: () => void,
  text: string,
  disabled?: boolean,
  loading?: boolean,
  icon?: ReactNode,
}

export default function BorderButton(props: ButtonProps) {
  return (
    <TouchableOpacity 
      onPress={props.onPress} 
      disabled={props.disabled || props.loading} 
      style={styles.button}
    >
        {props.loading && <ActivityIndicator color={'#fff'} />}
        {!props.loading && 
        <View style={styles.iconGroup}>
          {!!props.icon && props.icon}
          <Text style={styles.buttonText}>{props.text}</Text>
        </View>
        }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    width: "100%",
    height: 60,
    minHeight: 60,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffffff20",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
  },
  iconGroup: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  }
})

