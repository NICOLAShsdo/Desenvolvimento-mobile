import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import * as Contacts from "expo-contacts";

export default function App() {
  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.FirstName], // 🔹 apenas o primeiro nome
      });

      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Contatos (Primeiro Nome)
      </Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginVertical: 5 }}>
            {item.firstName}
          </Text>
        )}
      />

      <Button title="Recarregar Contatos" onPress={getContacts} />
    </View>
  );
}