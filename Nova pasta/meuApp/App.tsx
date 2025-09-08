import React from "react";
import { SafeAreaView, View, Text, useWindowDimensions } from "react-native";
import stylesPortrait from "./stylesPortrait";
import stylesLandscape from "./stylesLandscape";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const styles = isLandscape ? stylesLandscape : stylesPortrait;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header fixo */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercício 4</Text>
      </View>

      {/* Só Middle e Bottom */}
      <View style={styles.middle}>
        <Text>Middle</Text>
      </View>

      <View style={styles.bottom}>
        <Text>Bottom</Text>
      </View>
    </SafeAreaView>
  );
}