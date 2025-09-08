import React from "react";
import { SafeAreaView, View, Text, useWindowDimensions } from "react-native";
import stylesPortrait from "./stylesPortrait";
import stylesLandscape from "./stylesLandscape";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // seleciona os estilos de acordo com a orientação
  const styles = isLandscape ? stylesLandscape : stylesPortrait;

  return (
    <SafeAreaView style={styles.container}>
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