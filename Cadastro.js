import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';

const API_URL = 'http://localhost:3001';

const Cadastro = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const[senha,setSenha] = useState('');

  const handleSalvar = async () => {
    if (!nome || !email || !senha || !telefone) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    try{
      const response = await fetch(`${API_URL}/usuarios`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nome, email, senha, telefone}),
      });

      const data = await response.json();

      if(response.ok){
        Alert.alert('Sucesso', data.message);
        navigation.goBack();
      }else{
        Alert.alert('Erro', data.message || 'Erro ao cadastrar. Tente novamente.');
      }
    }catch(error){
      console.error('Erro de rede:', error);
      Alert.alert('Erro', data.message || 'Não foi possível conectar ao servidor. Verifica a conexão.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./img/Logo BarberCash.png')}
        style={styles.logo}
      />
      <View style={styles.box}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#777"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#777"
          value={senha}
          onChangeText={setSenha}
          keyboardType="visible-password"
        />


        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#777"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
          maxLength={11} //Limita a 11 números
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
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
    color: '#fff',
    marginBottom: 30,
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
});

export default Cadastro;
