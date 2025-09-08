import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import stylesPortrait from "./stylesPortrait";
import stylesLandscape from "./stylesLandscape";

const STORAGE_KEY = "@names_list";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const styles = isLandscape ? stylesLandscape : stylesPortrait;

  const [name, setName] = useState("");
  const [names, setNames] = useState<string[]>([]);

  // Carregar nomes do AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNames(JSON.parse(stored));
        }
      } catch (error) {
        console.log("Erro ao carregar nomes:", error);
      }
    };
    loadData();
  }, []);

  // Salvar sempre que a lista mudar
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(names));
      } catch (error) {
        console.log("Erro ao salvar nomes:", error);
      }
    };
    saveData();
  }, [names]);

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
        <Text style={styles.headerText}>Exercício 6</Text>
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

      {/* Lista persistida */}
      <FlatList
        data={names}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={localStyles.item}>{item}</Text>
        )}
      />

      {/* Middle e Bottom */}
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