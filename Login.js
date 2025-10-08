import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';

const API_URL = 'http://10.0.2.2:3001'; 

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message);
        navigation.navigate('Menu');
      } else {
        Alert.alert('Erro', data.message || 'Erro ao fazer login. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique a conexão.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
          source={require('./img/Logo BarberCash.png')}
          style={styles.logo}
        />
      <View style={styles.box}>
        <Text style={styles.title}>Bem-Vindo</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#777"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Link em texto para Cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>    
  </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 67, 70, 1)',
    padding: 20,
  },
  box: {
    padding: 20,
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 30,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#003a38ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default Login;