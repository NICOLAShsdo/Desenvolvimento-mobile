import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Discipline {
  id: number;
  name: string;
  workload: number | null;
  professor_name?: string | null;
}

const DisciplinesScreen: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [workload, setWorkload] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const loadDisciplines = async () => {
    try {
      const response = await api.get('/disciplines');
      setDisciplines(response.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Erro',
        err?.response?.data?.message || 'Falha ao carregar disciplinas'
      );
    }
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  const handleCreate = async () => {
    if (!name) {
      Alert.alert('Erro', 'Informe o nome da disciplina.');
      return;
    }

    try {
      const payload: any = {
        name,
        workload: workload ? Number(workload) : null
      };

      if (professorId) {
        payload.professor_id = Number(professorId);
      }

      await api.post('/disciplines', payload);
      setName('');
      setWorkload('');
      setProfessorId('');
      loadDisciplines();
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Erro',
        err?.response?.data?.message || 'Falha ao cadastrar disciplina'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disciplinas</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome da disciplina"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.helper}>Exemplo: Matemática, Física...</Text>

        <TextInput
          style={styles.input}
          placeholder="Carga horária"
          placeholderTextColor="#999"
          value={workload}
          onChangeText={setWorkload}
          keyboardType="numeric"
        />
        <Text style={styles.helper}>Informe a carga horária total (em horas)</Text>

        <TextInput
          style={styles.input}
          placeholder="ID do Professor (opcional)"
          placeholderTextColor="#999"
          value={professorId}
          onChangeText={setProfessorId}
        />
        <Text style={styles.helper}>Professor responsável pela disciplina</Text>

        <View style={styles.buttonWrapper}>
          <Button title="Cadastrar Disciplina" color="#2D6CDF" onPress={handleCreate} />
        </View>
      </View>

      <FlatList
        data={disciplines}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma disciplina cadastrada.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>

            {item.workload != null && (
              <Text style={styles.cardText}>⏳ Carga horária: {item.workload}h</Text>
            )}

            {item.professor_name && (
              <Text style={styles.cardText}>👨‍🏫 Professor: {item.professor_name}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#F3F6FA'
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2C49',
    marginBottom: 16
  },
  form: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  input: {
    borderWidth: 1,
    borderColor: '#C5CCD6',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 6
  },
  helper: {
    marginBottom: 12,
    color: '#4A5568',
    fontSize: 12,
    marginLeft: 4
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  emptyText: {
    textAlign: 'center',
    color: '#6D7480',
    marginTop: 20,
    fontSize: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DCE1EA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2C49',
    marginBottom: 6
  },
  cardText: {
    color: '#4A5568',
    fontSize: 15,
    marginBottom: 4
  }
});

export default DisciplinesScreen;
