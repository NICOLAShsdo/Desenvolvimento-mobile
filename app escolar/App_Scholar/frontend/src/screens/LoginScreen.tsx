import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@teste.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      signIn(response.data.user, response.data.token);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Aplicação Mobile Boletim</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonWrapper}>
          <Button
            title={loading ? 'Entrando...' : 'Entrar'}
            color="#2D6CDF"
            onPress={handleLogin}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F3F6FA'
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2C49',
    textAlign: 'center',
    marginBottom: 26
  },
  input: {
    borderWidth: 1,
    borderColor: '#C5CCD6',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 14
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  }
});

export default LoginScreen;
