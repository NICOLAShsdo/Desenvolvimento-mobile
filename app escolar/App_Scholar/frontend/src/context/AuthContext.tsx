import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'student';
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const signIn = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);

    // ⬇️ AQUI é o pulo do gato: colocar o token em TODAS as requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
