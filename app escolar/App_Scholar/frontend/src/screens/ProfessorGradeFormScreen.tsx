import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProfessorGradeForm'
>;

const ProfessorGradeFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { disciplineId, disciplineName, studentId, studentName } = route.params;

  const [grade1, setGrade1] = useState('');
  const [grade2, setGrade2] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    if (!grade1 || !grade2) {
      Alert.alert('Erro', 'Informe as duas notas.');
      return;
    }

    try {
      await api.post('/grades/professor/grades', {
        student_id: studentId,
        discipline_id: disciplineId,
        grade1: Number(grade1),
        grade2: Number(grade2),
        status: status || undefined
      });

      Alert.alert('Sucesso', 'Notas registradas com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Erro',
        err?.response?.data?.message ||
          'Não foi possível registrar/atualizar as notas.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{disciplineName}</Text>
      <Text style={styles.subtitle}>Aluno: {studentName}</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nota 1"
          value={grade1}
          onChangeText={setGrade1}
          keyboardType="numeric"
        />
        <Text style={styles.helper}>Digite a primeira avaliação</Text>

        <TextInput
          style={styles.input}
          placeholder="Nota 2"
          value={grade2}
          onChangeText={setGrade2}
          keyboardType="numeric"
        />
        <Text style={styles.helper}>Digite a segunda avaliação</Text>

        <TextInput
          style={styles.input}
          placeholder="Status (Aprovado, Reprovado...)"
          value={status}
          onChangeText={setStatus}
        />
        <Text style={styles.helper}>Situação final do aluno</Text>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Notas</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2C49',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
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
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 6,
    fontSize: 15
  },
  helper: {
    color: '#6D7480',
    fontSize: 12,
    marginBottom: 14,
    marginLeft: 2
  },
  button: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});

export default ProfessorGradeFormScreen;
