import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Cliente = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Clientes</Text>
      <Button 
        title="Voltar para o Menu" 
        onPress={() => navigation.navigate('Menu')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Cliente;
