import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfessorDisciplinesScreen from './src/screens/ProfessorDisciplinesScreen';
import ProfessorDisciplineStudentsScreen from './src/screens/ProfessorDisciplineStudentsScreen';
import ProfessorGradeFormScreen from './src/screens/ProfessorGradeFormScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import DisciplinesScreen from './src/screens/DisciplinesScreen';
import ProfessorsScreen from './src/screens/ProfessorsScreen';
import BoletimScreen from './src/screens/BoletimScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RootStackParamList } from './src/types/navigation';


const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes: React.FC = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        initialRouteName={user ? 'Home' : 'Login'}
      >
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Início' }}
            />

            <Stack.Screen
  name="ProfessorDisciplines"
  component={ProfessorDisciplinesScreen}
  options={{ title: 'Minhas disciplinas' }}
/>

<Stack.Screen
  name="ProfessorDisciplineStudents"
  component={ProfessorDisciplineStudentsScreen}
  options={{ title: 'Alunos da disciplina' }}
/>

<Stack.Screen
  name="ProfessorGradeForm"
  component={ProfessorGradeFormScreen}
  options={{ title: 'Lançar notas' }}
/>

            <Stack.Screen
              name="Students"
              component={StudentsScreen}
              options={{ title: 'Alunos' }}
            />
            <Stack.Screen
              name="Disciplines"
              component={DisciplinesScreen}
              options={{ title: 'Disciplinas' }}
            />
            <Stack.Screen
              name="Professors"
              component={ProfessorsScreen}
              options={{ title: 'Professores' }}
            />
            <Stack.Screen
              name="Boletim"
              component={BoletimScreen}
              options={{ title: 'Boletim' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
