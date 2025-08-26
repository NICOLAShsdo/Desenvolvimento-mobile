import React from "react";
import { View, Button, Linking, Alert } from "react-native";

export default function App() {
  const instagramUrl = "https://www.instagram.com/fatec_jacarei";
  const instagramAppUrl = "instagram://user?username=fatec_jacarei"; // abre no app, se instalado

  const openInstagram = async () => {
    try {
      // Tenta abrir no aplicativo do Instagram
      const supported = await Linking.canOpenURL(instagramAppUrl);
      if (supported) {
        await Linking.openURL(instagramAppUrl);
      } else {
        // Se não estiver instalado, abre no navegador
        await Linking.openURL(instagramUrl);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir o Instagram.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Abrir Fatec Jacareí no Instagram" onPress={openInstagram} />
    </View>
  );
}