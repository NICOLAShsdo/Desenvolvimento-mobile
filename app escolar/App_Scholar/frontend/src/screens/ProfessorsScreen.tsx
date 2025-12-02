import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Professors'>;

type Professor = {
  id: number;
  name: string;
  title?: string;
  experience_years?: number;
};

const ProfessorsScreen: React.FC<Props> = () => {
  const { token } = useAuth();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  const loadProfessors = async () => {
    try {
      const response = await api.get<Professor[]>('/professors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfessors(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    }
  };

  const handleCreate = async () => {
    if (!name) {
      Alert.alert('Erro', 'Nome é obrigatório.');
      return;
    }
    try {
      await api.post(
        '/professors',
        {
          name,
          title,
          experience_years: experienceYears ? Number(experienceYears) : undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setTitle('');
      setExperienceYears('');
      loadProfessors();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao criar professor.');
    }
  };

  useEffect(() => {
    loadProfessors();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Professores</Text>

      {/* CARD DO FORM */}
      <View style={styles.card}>

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome completo"
          placeholderTextColor="#8a8a8a"
          value={name}
          onChangeText={setName}
        />

        {/* Titulação */}
        <Text style={styles.label}>Titulação</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Doutor, Mestre..."
          placeholderTextColor="#8a8a8a"
          value={title}
          onChangeText={setTitle}
        />

        {/* Experiência */}
        <Text style={styles.label}>Tempo de Docência (anos)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 5"
          placeholderTextColor="#8a8a8a"
          value={experienceYears}
          onChangeText={setExperienceYears}
          keyboardType="numeric"
        />

        {/* BOTÃO */}
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Cadastrar Professor</Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={professors}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {item.title ? <Text style={styles.itemSub}>Titulação: {item.title}</Text> : null}
            {item.experience_years != null ? (
              <Text style={styles.itemSub}>Experiência: {item.experience_years} anos</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const colors = {
  primary: '#1E88E5', // Azul
  primaryDark: '#1565C0',
  grayLight: '#f1f1f3',
  grayMedium: '#cccccc',
  textDark: '#333',
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f7fa' },

  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.primaryDark,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
    marginLeft: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.grayMedium,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
    color: colors.textDark,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  item: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginBottom: 10,
  },

  itemTitle: { fontWeight: '700', fontSize: 16, color: colors.primaryDark },
  itemSub: { fontSize: 13, color: '#444' },
});

export default ProfessorsScreen;
