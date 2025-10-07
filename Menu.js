import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Menu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Principal</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.buttonText}>Cadastro</Text>
      </TouchableOpacity>

      <View style={styles.box}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#e74c3c' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: "#000000"}]}
          onPress={() => navigation.navigate('Lancamento')}
        >
          <Text style={styles.buttonText}>Lançamentos</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  box: {
    padding: 20,
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '80%',
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Menu;
