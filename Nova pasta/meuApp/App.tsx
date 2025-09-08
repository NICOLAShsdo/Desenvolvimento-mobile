import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import stylesPortrait from "./stylesPortrait";
import stylesLandscape from "./stylesLandscape";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const styles = isLandscape ? stylesLandscape : stylesPortrait;

  const [name, setName] = useState("");
  const [names, setNames] = useState<string[]>([]);

  const handleAddName = () => {
    if (name.trim() !== "") {
      setNames([...names, name.trim()]);
      setName("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercício 5</Text>
      </View>

      {/* Input */}
      <TextInput
        style={localStyles.input}
        placeholder="Digite um nome"
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={handleAddName}
      />

      {/* Lista */}
      <FlatList
        data={names}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={localStyles.item}>{item}</Text>
        )}
      />

      {/* Mantém Middle e Bottom */}
      <View style={styles.middle}>
        <Text>Middle</Text>
      </View>

      <View style={styles.bottom}>
        <Text>Bottom</Text>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#333",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  item: {
    fontSize: 16,
    marginVertical: 4,
    marginLeft: 12,
  },
});