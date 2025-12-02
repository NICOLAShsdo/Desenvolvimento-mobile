import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProfessorDisciplines'
>;

type Discipline = {
  id: number;
  name: string;
  workload: number | null;
};

const ProfessorDisciplinesScreen: React.FC<Props> = ({ navigation }) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDisciplines = async () => {
    try {
      setLoading(true);
      const response = await api.get<Discipline[]>('/grades/professor/disciplines');
      setDisciplines(response.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Erro',
        err?.response?.data?.message || 'Não foi possível carregar as disciplinas.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  const handleOpenDiscipline = (disc: Discipline) => {
    navigation.navigate('ProfessorDisciplineStudents', {
      disciplineId: disc.id,
      disciplineName: disc.name
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6CDF" />
        <Text style={styles.loadingText}>Carregando disciplinas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas disciplinas</Text>

      {disciplines.length === 0 ? (
        <Text style={styles.empty}>
          Nenhuma disciplina vinculada a este professor.
        </Text>
      ) : (
        <FlatList
          data={disciplines}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleOpenDiscipline(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>

              {item.workload != null && (
                <Text style={styles.cardText}>
                  ⏳ Carga horária: {item.workload}h
                </Text>
              )}

              <Text style={styles.cardLink}>Ver alunos / lançar notas →</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#F3F6FA'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F6FA'
  },
  loadingText: {
    marginTop: 10,
    color: '#4A5568',
    fontSize: 15
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2C49',
    marginBottom: 16
  },
  empty: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6D7480',
    fontSize: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DCE1EA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
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
    marginBottom: 6
  },
  cardLink: {
    color: '#2D6CDF',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600'
  }
});

export default ProfessorDisciplinesScreen;
