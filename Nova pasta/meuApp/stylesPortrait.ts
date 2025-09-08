import { StyleSheet } from "react-native";

const stylesPortrait = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#FFA07A",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FA8072",
  },
  bottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6347",
  },
});

export default stylesPortrait;