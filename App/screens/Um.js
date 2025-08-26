import React, { useEffect, useState } from "react";
import { View, Text, FlatList, PermissionsAndroid, Platform } from "react-native";
import Contacts from "react-native-contacts";

export default function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      if (Platform.OS === "android") {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );

        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
          Contacts.getAll().then(data => {
            if (data.length > 0) {
              // 🔹 Filtra os contatos cujo nome começa com "C"
              const filtered = data.filter(contact =>
                contact.displayName?.toUpperCase().startsWith("C")
              );
              setContacts(filtered);
            }
          });
        }
      } else {
        Contacts.getAll().then(data => {
          if (data.length > 0) {
            const filtered = data.filter(contact =>
              contact.displayName?.toUpperCase().startsWith("C")
            );
            setContacts(filtered);
          }
        });
      }
    };

    getContacts();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Contatos que começam com "C"
      </Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.recordID}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginVertical: 5 }}>
            {item.displayName}
          </Text>
        )}
      />
    </View>
  );
}