import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Boletim'>;

type BoletimEntry = {
  discipline_name: string;
  workload?: number;
  grade1?: number;
  grade2?: number;
  average?: number;
  status?: string;
};

type BoletimResponse = {
  student: {
    id: number;
    name: string;
    registration: string;
    course: string;
  };
  boletim: BoletimEntry[];
};

const BoletimScreen: React.FC<Props> = () => {
  const { user, token } = useAuth();
  const [boletimData, setBoletimData] = useState<BoletimResponse | null>(null);
  const [studentId, setStudentId] = useState('');

  const loadBoletim = async () => {
    try {
      const url =
        user?.role === 'student' || !studentId
          ? '/boletim/me'
          : `/boletim/${studentId}`;

      const response = await api.get<BoletimResponse>(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoletimData(response.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err?.response?.data?.message || 'Não foi possível carregar o boletim.');
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      loadBoletim();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletim Acadêmico</Text>

      {user?.role !== 'student' && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="ID do aluno"
            placeholderTextColor="#999"
            value={studentId}
            onChangeText={setStudentId}
            keyboardType="numeric"
          />
          <View style={styles.buttonWrapper}>
            <Button title="Buscar boletim" onPress={loadBoletim} color="#2D6CDF" />
          </View>
        </View>
      )}

      {boletimData && (
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Aluno: <Text style={styles.bold}>{boletimData.student.name}</Text></Text>
          <Text style={styles.headerSub}>Matrícula: {boletimData.student.registration}</Text>
          <Text style={styles.headerSub}>Curso: {boletimData.student.course}</Text>
        </View>
      )}

      <FlatList
        data={boletimData?.boletim || []}
        keyExtractor={(item, index) => `${item.discipline_name}-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum registro de boletim.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.discipline_name}</Text>

            {item.workload != null && (
              <Text style={styles.cardText}>📘 Carga horária: {item.workload}h</Text>
            )}

            <Text style={styles.cardText}>📝 Nota 1: {item.grade1 ?? '-'}</Text>
            <Text style={styles.cardText}>📝 Nota 2: {item.grade2 ?? '-'}</Text>
            <Text style={styles.cardHighlight}>⭐ Média: {item.average ?? '-'}</Text>
            <Text style={styles.cardStatus}>📌 Status: {item.status ?? '-'}</Text>
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
    marginBottom: 14 
  },
  form: { marginBottom: 18 },
  input: {
    borderWidth: 1,
    borderColor: '#C5CCD6',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 16
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  headerBox: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE3EC',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  headerText: { fontSize: 18, color: '#1F2C49' },
  bold: { fontWeight: '700' },
  headerSub: { color: '#4A5568', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#6D7480' },
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
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2C49', marginBottom: 8 },
  cardText: { fontSize: 15, color: '#4A5568', marginBottom: 4 },
  cardHighlight: { fontSize: 16, fontWeight: '600', color: '#2D6CDF', marginTop: 4 },
  cardStatus: { fontSize: 15, fontWeight: '600', marginTop: 6 }
});

export default BoletimScreen;
