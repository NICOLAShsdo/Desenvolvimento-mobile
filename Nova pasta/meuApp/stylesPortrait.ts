import { StyleSheet } from "react-native";

const stylesPortrait = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFA07A", // Laranja claro
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FA8072", // Vermelho salmão
  },
  bottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6347", // Tomate
  },
});

export default stylesPortrait;