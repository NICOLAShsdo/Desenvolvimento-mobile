import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Um() {
  return (
    <View style={styles.container}>
      {/* Parte de cima dividida em 2 colunas */}
      <View style={styles.top}>
        <View style={styles.left} />
        <View style={styles.right} />
      </View>

      {/* Parte de baixo */}
      <View style={styles.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Constants.statusBarHeight,
  },
  top: {
    flex: 0.5,
    flexDirection: 'row', // filhos em linha (lado a lado)
  },
  left: {
    flex: 0.5,
    backgroundColor: 'lime',
  },
  right: {
    flex: 0.5,
    backgroundColor: 'aquamarine',
  },
  bottom: {
    flex: 0.5,
    backgroundColor: 'salmon',
  },
});