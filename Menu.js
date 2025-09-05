import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Menu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Menu</Text>
      <Button 
        title="Ir para Tela Clientes" 
        onPress={() => navigation.navigate('Cliente')} 
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

export default Menu;
