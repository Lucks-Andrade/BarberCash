import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style = {styles.titulo}>CADASTRO DE CLIENTES</Text>
      <Text style = {styles.subtitulo}>ENTRADA DE DADOS</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0ce5f5ff',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    margin: 10,
    fontSize: 35,
  },
  subtitulo: {
    margin: 10,
    fontSize: 15,
  }
});

