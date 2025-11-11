// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas principais
import Login from './Login';
import Cadastro from './Cadastro';
import Dashboard from './Dashboard';
import Lancamento from './Lancamento';

// Navegação por abas (menu fixo)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Abas inferiores (menu fixo) ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Isso oculta o cabeçalho padrão nas telas Dashboard e Lançamentos
        tabBarStyle: {
          backgroundColor: 'rgba(1, 67, 70, 1)', // Cor de fundo da sua barra
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
        },
        tabBarActiveTintColor: '#fff', // Cor do ícone/texto ativo
        tabBarInactiveTintColor: '#b5b5b5', // Cor do ícone/texto inativo
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home-outline';
          else if (route.name === 'Lançamentos') iconName = 'list-outline';
          // Adicione um ícone para "Sair" ou "Perfil" se desejar adicionar uma terceira aba
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Lançamentos" component={Lancamento} />
      {/* Você pode adicionar uma terceira aba, como "Perfil" ou "Configurações" */}
      {/* <Tab.Screen name="Perfil" component={PerfilScreen} /> */}
    </Tab.Navigator>
  );
}

// --- Navegação principal (Stack) ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        {/* Após o login, o usuário será direcionado para MainTabs, que contém o menu fixo */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}