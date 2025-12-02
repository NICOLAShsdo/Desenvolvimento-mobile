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
  'ProfessorDisciplineStudents'
>;

type Student = {
  id: number;
  name: string;
  registration: string;
  course: string;
};

const ProfessorDisciplineStudentsScreen: React.FC<Props> = ({
  route,
  navigation
}) => {
  const { disciplineId, disciplineName } = route.params;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get<Student[]>(
        `/grades/professor/disciplines/${disciplineId}/students`
      );
      setStudents(response.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Erro',
        err?.response?.data?.message ||
          'Não foi possível carregar os alunos da disciplina.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: disciplineName });
    loadStudents();
  }, [disciplineId]);

  const handleOpenGradeForm = (student: Student) => {
    navigation.navigate('ProfessorGradeForm', {
      disciplineId,
      disciplineName,
      studentId: student.id,
      studentName: student.name
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6CDF" />
        <Text style={styles.loadingText}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Alunos da disciplina: <Text style={styles.highlight}>{disciplineName}</Text>
      </Text>

      {students.length === 0 ? (
        <Text style={styles.empty}>
          Nenhum aluno vinculado ainda a esta disciplina.
        </Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleOpenGradeForm(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>📘 Matrícula: {item.registration}</Text>
              <Text style={styles.cardText}>🎓 Curso: {item.course}</Text>

              <Text style={styles.cardLink}>Lançar / atualizar notas →</Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2C49',
    marginBottom: 16
  },
  highlight: {
    color: '#2D6CDF',
    fontWeight: '700'
  },
  empty: {
    marginTop: 20,
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
    marginBottom: 4
  },
  cardLink: {
    color: '#2D6CDF',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600'
  }
});

export default ProfessorDisciplineStudentsScreen;
