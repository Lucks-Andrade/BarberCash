import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native'; // Importa o hook

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const [periodoAtivo, setPeriodoAtivo] = useState('dia');
  
  // Estado inicial zerado para evitar crash
  const [saldos, setSaldos] = useState({ valor: 0, entradas: 0, saidas: 0 }); 
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [ultimosLancamentos, setUltimosLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused(); // Hook para saber se a tela está em foco

  const API_URL = 'http://192.168.0.164:3001';  //10.0.2.2 TROCAR PARA ESSE IP QUANDO USAR O ANDROID STUDIO, 192.168.0.164 IP PARA USAR NO CELULAR 

  // useCallback para evitar recriação desnecessária da função
  const carregarDados = useCallback(async () => {
    // Só busca dados se a tela estiver em foco
    if (!isFocused) return; 
    
    setLoading(true);
    try {
      // Passa o 'periodoAtivo' como query param para o backend
      const [resumoRes, graficoRes, lancamentosRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/resumo?periodo=${periodoAtivo}`),
        fetch(`${API_URL}/dashboard/entradas-categoria?periodo=${periodoAtivo}`),
        fetch(`${API_URL}/dashboard/ultimos-lancamentos?periodo=${periodoAtivo}`)
      ]);

      const resumo = await resumoRes.json();
      const grafico = await graficoRes.json();
      const lancamentos = await lancamentosRes.json();

      // Define os estados com fallback para evitar crash
      setSaldos(resumo.success === false ? { valor: 0, entradas: 0, saidas: 0 } : resumo);
      setDadosGrafico(grafico.success === false ? [] : grafico);
      setUltimosLancamentos(lancamentos.success === false ? [] : lancamentos);

    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard.');
      // Zera os dados em caso de erro de rede
      setSaldos({ valor: 0, entradas: 0, saidas: 0 }); 
      setDadosGrafico([]);
      setUltimosLancamentos([]);
    } finally {
      setLoading(false);
    }
  }, [isFocused, periodoAtivo]); // Roda de novo se o foco ou o período mudar

  // useEffect para carregar os dados
  useEffect(() => {
    carregarDados();
  }, [carregarDados]); // Roda a função 'carregarDados' sempre que ela mudar

  const saldoAtual = saldos; // Estado já é o objeto direto
  const temDadosGrafico = dadosGrafico.length > 0 && dadosGrafico.some(d => d.valor > 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Resumo do seu negócio</Text>

      {/* CARD PRINCIPAL */}
      <View style={styles.cardPrincipal}>
        <View style={styles.seletorPeriodo}>
          <TouchableOpacity onPress={() => setPeriodoAtivo('dia')}>
            <Text style={[styles.periodoTexto, periodoAtivo === 'dia' && styles.periodoAtivo]}>Dia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriodoAtivo('semana')}>
            <Text style={[styles.periodoTexto, periodoAtivo === 'semana' && styles.periodoAtivo]}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriodoAtivo('mes')}>
            <Text style={[styles.periodoTexto, periodoAtivo === 'mes' && styles.periodoAtivo]}>Mês</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardPrincipalValor}>
          R$ {saldoAtual.valor.toFixed(2).replace('.', ',')}
        </Text>
        <View style={styles.entradasSaidasContainer}>
          <View style={styles.entradasSaidasBox}>
            <Text style={styles.entradasLabel}>Entradas</Text>
            <Text style={styles.entradasValor}>R$ {saldoAtual.entradas.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.entradasSaidasBox}>
            <Text style={styles.saidasLabel}>Saídas</Text>
            <Text style={styles.saidasValor}>R$ {saldoAtual.saidas.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      </View>

      {/* GRÁFICO DE PIZZA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Entradas por Categoria ({periodoAtivo.charAt(0).toUpperCase() + periodoAtivo.slice(1)})</Text>
        <View style={styles.graficoContainer}>
          {temDadosGrafico ? (
            <PieChart
              data={dadosGrafico}
              width={screenWidth - 40}
              height={220}
              chartConfig={{ 
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForLabels: {
                  fontSize: 12,
                },
              }}
              accessor="valor"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text style={styles.semDadosTexto}>Nenhuma entrada registrada.</Text>
          )}
        </View>
      </View>

      {/* ÚLTIMOS LANÇAMENTOS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Últimos Lançamentos ({periodoAtivo.charAt(0).toUpperCase() + periodoAtivo.slice(1)})</Text>
        {ultimosLancamentos.length > 0 ? (
          ultimosLancamentos.map((item) => (
            <View key={item.id} style={styles.lancamentoItem}>
              <Text style={styles.lancamentoDescricao}>{item.descricao}</Text>
              <Text style={item.tipo === 'Entrada' ? styles.lancamentoValorEntrada : styles.lancamentoValorSaida}>
                {item.tipo === 'Saída' ? '- R$' : 'R$'} {Math.abs(item.valor).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.semDadosTexto}>Nenhum lançamento.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(1, 67, 70, 1)',
    paddingHorizontal: 20, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 67, 70, 1)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', alignSelf: 'center', marginTop: 50, marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#ccc', alignSelf: 'center', marginBottom: 20 },
  cardPrincipal: { backgroundColor: 'rgba(0, 107, 111, 0.87)', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', elevation: 5 },
  seletorPeriodo: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 20, padding: 5, marginBottom: 15 },
  periodoTexto: { fontSize: 16, color: '#fff', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 15 },
  periodoAtivo: { backgroundColor: '#003a38ff', fontWeight: 'bold', elevation: 3 },
  cardPrincipalValor: { fontSize: 42, fontWeight: 'bold', color: '#fff', marginVertical: 5 },
  entradasSaidasContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15 },
  entradasSaidasBox: { alignItems: 'center', flex: 1 },
  entradasLabel: { fontSize: 16, color: '#4a90e2', fontWeight: 'bold' },
  entradasValor: { fontSize: 18, color: '#4a90e2', fontWeight: 'bold' },
  saidasLabel: { fontSize: 16, color: '#e74c3c', fontWeight: 'bold' },
  saidasValor: { fontSize: 18, color: '#e74c3c', fontWeight: 'bold' },
  card: { backgroundColor: 'rgba(0, 107, 111, 0.87)', borderRadius: 15, padding: 20, marginBottom: 20, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  graficoContainer: {
    alignItems: 'center',
  },
  semDadosTexto: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 80, 
  },
  lancamentoItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  lancamentoDescricao: { fontSize: 16, color: '#fff' },
  lancamentoValorEntrada: { fontSize: 16, color: '#2ecc71', fontWeight: 'bold' },
  lancamentoValorSaida: { fontSize: 16, color: '#e74c3c', fontWeight: 'bold' },
});

export default Dashboard;