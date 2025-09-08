import { StyleSheet } from "react-native";

const stylesLandscape = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE8AA", // Amarelo claro
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0E68C", // Caqui
  },
  bottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BDB76B", // Dark Khaki
  },
});

export default stylesLandscape;