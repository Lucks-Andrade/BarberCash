import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Menu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Principal</Text>

      <View style={styles.menuContainer}>
        {/* Botão do Dashboard */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>

        {/* Botão de Lançamentos */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Lancamento')}
        >
          <Text style={styles.buttonText}>Lançamentos</Text>
        </TouchableOpacity>

        {/* Botão de Sair */}
        <TouchableOpacity
          style={[styles.menuButton, styles.exitButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Sair</Text>
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
  menuContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    borderRadius: 10,
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
  exitButton: {
    backgroundColor: '#c0392b',
    marginTop: 20,
  },
});

export default Menu;