import React, { useState } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Abre a galeria
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Abre a câmera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Permissão para usar a câmera é necessária!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botões no canto superior direito */}
      <View style={styles.topButtons}>
        <MaterialIcons
          name="photo"
          size={32}
          color="deepskyblue"
          onPress={openGallery}
          style={styles.icon}
        />
        <MaterialIcons
          name="photo-camera"
          size={32}
          color="deepskyblue"
          onPress={openCamera}
          style={styles.icon}
        />
      </View>

      {/* Exibe a imagem selecionada */}
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topButtons: {
    position: "absolute",
    top: StatusBar.currentHeight || 30, // usa altura da status bar
    right: 20,
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  image: {
    flex: 1,
    marginTop: 80,
    resizeMode: "contain",
  },
});