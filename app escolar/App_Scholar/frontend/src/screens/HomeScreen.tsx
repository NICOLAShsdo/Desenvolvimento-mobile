import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name}</Text>
      <Text style={styles.subtitle}>Perfil: {user?.role}</Text>

      <View style={styles.card}>
        {user?.role === 'student' ? (
          <>
            <View style={styles.buttonWrapper}>
              <Button
                title="Ver meu boletim"
                color="#2D6CDF"
                onPress={() => navigation.navigate('Boletim')}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.buttonWrapper}>
              <Button
                title="Alunos"
                color="#2D6CDF"
                onPress={() => navigation.navigate('Students')}
              />
            </View>

            {user?.role === 'admin' && (
              <View style={styles.buttonWrapper}>
                <Button
                  title="Disciplinas"
                  color="#2D6CDF"
                  onPress={() => navigation.navigate('Disciplines')}
                />
              </View>
            )}

            {user?.role === 'admin' && (
              <View style={styles.buttonWrapper}>
                <Button
                  title="Professores"
                  color="#2D6CDF"
                  onPress={() => navigation.navigate('Professors')}
                />
              </View>
            )}

            <View style={styles.buttonWrapper}>
              <Button
                title="Boletim (por aluno)"
                color="#2D6CDF"
                onPress={() => navigation.navigate('Boletim')}
              />
            </View>
          </>
        )}

        {user?.role === 'professor' && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Lançar notas"
              color="#2D6CDF"
              onPress={() => navigation.navigate('ProfessorDisciplines')}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.logoutButton}>
          <Button title="Sair" color="#c0392b" onPress={signOut} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F6FA'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2C49',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 24
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
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20
  },
  buttonWrapper: {
    marginBottom: 14,
    borderRadius: 10,
    overflow: 'hidden'
  },
  footer: {
    marginTop: 20
  },
  logoutButton: {
    borderRadius: 10,
    overflow: 'hidden'
  }
});

export default HomeScreen;
