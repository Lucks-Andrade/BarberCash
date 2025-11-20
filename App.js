// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas principais
import Login from './Login';
import Cadastro from './Cadastro';
import Dashboard from './Dashboard';
import Catalogo from './Catalogo';
import Lancamentos from './Lancamentos';

// Navegação por abas (menu fixo)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Abas inferiores (menu fixo) ---
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard" // DEFINE A TELA INICIAL DO APP
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: 'rgba(1, 67, 70, 1)', 
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
        },
        tabBarActiveTintColor: '#fff', 
        tabBarInactiveTintColor: '#b5b5b5', 
        
        // 3. LÓGICA DE ÍCONES CORRIGIDA
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = 'stats-chart-outline'; // Ícone de gráfico
          } else if (route.name === 'Lançamentos') {
            iconName = 'add-circle-outline'; // Ícone de adicionar
          } else if (route.name === 'Catálogo') { // Nome com acento
            iconName = 'book-outline'; // Ícone de livro (catálogo)
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { 
          paddingBottom: 5,
          fontSize: 12,
        }
      })}
    >
      {/* 4. TELAS NAS ABAS (Sem espaços ou comentários entre elas) */}
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Lançamentos" component={Lancamentos} />
      <Tab.Screen name="Catálogo" component={Catalogo} />
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
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}