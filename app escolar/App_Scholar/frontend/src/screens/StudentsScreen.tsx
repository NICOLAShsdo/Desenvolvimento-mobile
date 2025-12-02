import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Students'>;

type Student = {
  id: number;
  name: string;
  registration: string;
  course: string;
};

const StudentsScreen: React.FC<Props> = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [course, setCourse] = useState('');

  const loadStudents = async () => {
    try {
      const response = await api.get<Student[]>('/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    }
  };

  const handleCreate = async () => {
    if (!name || !registration || !course) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    try {
      await api.post(
        '/students',
        { name, registration, course },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setRegistration('');
      setCourse('');
      loadStudents();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao criar aluno.');
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Alunos</Text>

      {/* CARD DO FORM */}
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome completo"
          placeholderTextColor="#8a8a8a"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          style={styles.input}
          placeholder="Número da matrícula"
          placeholderTextColor="#8a8a8a"
          value={registration}
          onChangeText={setRegistration}
        />

        <Text style={styles.label}>Curso</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: ADS, GTI, Eng. Software..."
          placeholderTextColor="#8a8a8a"
          value={course}
          onChangeText={setCourse}
        />

        {/* BOTÃO */}
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSub}>Matrícula: {item.registration}</Text>
            <Text style={styles.itemSub}>Curso: {item.course}</Text>
          </View>
        )}
      />
    </View>
  );
};

const colors = {
  primary: '#1E88E5',
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

  itemTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.primaryDark,
  },

  itemSub: {
    fontSize: 13,
    color: '#444',
  },
});

export default StudentsScreen;
