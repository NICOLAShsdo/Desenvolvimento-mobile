import { StyleSheet } from "react-native";

const stylesLandscape = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: 12,
    alignItems: "center",
    backgroundColor: "#EEE8AA",
    zIndex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0E68C",
  },
  bottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BDB76B",
  },
});

export default stylesLandscape;