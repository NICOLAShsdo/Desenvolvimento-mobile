import React from "react";
import { SafeAreaView, Text, StyleSheet, useWindowDimensions } from "react-native";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLandscape ? "#1E90FF" : "#FFA500" }, // azul landscape, laranja portrait
      ]}
    >
      <Text style={styles.text}>
        {isLandscape ? "Tela em modo landscape" : "Tela em modo portrait"}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});