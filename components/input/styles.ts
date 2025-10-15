import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#ffffff20",
    maxHeight: 70,
    minHeight: 70,
    marginTop: 10,
    lineHeight: 70,
    marginBottom: 10,
    borderRadius: 10,
    zIndex: 1,
  },
  input: {
    flex: 1,
    maxHeight: 50,
    minHeight: 50,
    width: "100%",
    outlineWidth: 0,
    color: "#ffffff70",
    zIndex: 5,
    fontSize: 16,
    paddingTop: 12,
    lineHeight: 16,
    includeFontPadding: false,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  label: {
    position: "absolute",
    left: 18,
    zIndex: 2,
    fontFamily: "Poppins_400Regular",
  }
})