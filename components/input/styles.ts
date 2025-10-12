import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ffffff20",
    maxHeight: 60,
    minHeight: 60,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 18,
  },
  containerPasswrod: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#ffffff20",
    maxHeight: 60,
    minHeight: 60,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    width: "100%",
    outlineWidth: 0,
    color: "#ffffff70",
  }
})