import React from "react";
import { View, Button, Linking, Alert } from "react-native";

export default function App() {
  const videoId = "dQw4w9WgXcQ"; // ID do vídeo no YouTube
  const youtubeAppUrl = vnd.youtube//${videoId};
  const youtubeWebUrl = https//www.youtube.com/watch?v=${videoId};

  const openYouTube = async () => {
    try {
      // Primeiro tenta abrir no app do YouTube
      const supported = await Linking.canOpenURL(youtubeAppUrl);
      if (supported) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        // Se não tiver app, abre no navegador
        await Linking.openURL(youtubeWebUrl);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir o YouTube.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Abrir vídeo no YouTube" onPress={openYouTube} />
    </View>
  );
}