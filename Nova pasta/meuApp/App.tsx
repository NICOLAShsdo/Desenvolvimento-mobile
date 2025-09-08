import React from "react";
import { SafeAreaView, View, Text, StyleSheet, useWindowDimensions } from "react-native";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { flexDirection: isLandscape ? "row" : "column" },
      ]}
    >
      <View style={styles.top}>
        <Text>Top</Text>
      </View>

      <View style={styles.middle}>
        <Text>Middle</Text>
      </View>

      <View style={styles.bottom}>
        <Text>Bottom</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFA07A",
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