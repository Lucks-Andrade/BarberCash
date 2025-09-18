import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import Menu from './Menu';
import Cliente from './Cadastro';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4a90e2', // cor da barra superior
          },
          headerTintColor: '#fff', // cor do texto do header
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          cardStyle: {
            backgroundColor: '#f5f5f5', // fundo das telas
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // esconde o header no Login
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ title: 'Menu Principal' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cliente}
          options={{ headerShown: false  }}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
