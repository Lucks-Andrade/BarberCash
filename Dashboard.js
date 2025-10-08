import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// A largura da tela continua sendo útil
const screenWidth = Dimensions.get('window').width;

// --- DADOS DE EXEMPLO (sem alterações) ---
const dadosDashboard = {
  saldos: {
    dia: { valor: 255.00, entradas: 350.00, saidas: 95.00 },
    semana: { valor: 1480.50, entradas: 1800.00, saidas: 319.50 },
    mes: { valor: 5650.75, entradas: 7200.00, saidas: 1549.25 },
  },
  ultimosLancamentos: [
    { id: '1', descricao: 'Corte + Barba', valor: 65.00, tipo: 'Entrada' },
    { id: '2', descricao: 'Venda de Pomada', valor: 35.00, tipo: 'Entrada' },
    { id: '3', descricao: 'Compra de Lâminas', valor: -15.00, tipo: 'Saida' },
  ],
  dadosGrafico: {
    dia: [
        { nome: 'Cortes', valor: 180, color: '#006b6f', legendFontColor: '#FFF', legendFontSize: 14 },
        { nome: 'Vendas', valor: 95, color: '#4a90e2', legendFontColor: '#FFF', legendFontSize: 14 },
    ],
    semana: [
        { nome: 'Cortes', valor: 1200, color: '#006b6f', legendFontColor: '#FFF', legendFontSize: 14 },
        { nome: 'Vendas', valor: 450, color: '#4a90e2', legendFontColor: '#FFF', legendFontSize: 14 },
        { nome: 'Outros', valor: 150, color: '#f5a623', legendFontColor: '#FFF', legendFontSize: 14 },
    ],
    mes: [
        { nome: 'Cortes', valor: 4500, color: '#006b6f', legendFontColor: '#FFF', legendFontSize: 14 },
        { nome: 'Vendas', valor: 1800, color: '#4a90e2', legendFontColor: '#FFF', legendFontSize: 14 },
        { nome: 'Outros', valor: 900, color: '#f5a623', legendFontColor: '#FFF', legendFontSize: 14 },
    ]
  }
};

const chartConfig = {
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const Dashboard = ({ navigation }) => {
  const [periodoAtivo, setPeriodoAtivo] = useState('dia');
  const saldoAtual = dadosDashboard.saldos[periodoAtivo];
  const dadosGraficoAtual = dadosDashboard.dadosGrafico[periodoAtivo] || [];
  const temDadosParaGrafico = dadosGraficoAtual.length > 0 && dadosGraficoAtual.some(item => item.valor > 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Resumo do seu negócio</Text>

      {/* Card Principal - Sem alterações */}
      <View style={styles.cardPrincipal}>
        <View style={styles.seletorPeriodo}>
          <TouchableOpacity onPress={() => setPeriodoAtivo('dia')}><Text style={[styles.periodoTexto, periodoAtivo === 'dia' && styles.periodoAtivo]}>Dia</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriodoAtivo('semana')}><Text style={[styles.periodoTexto, periodoAtivo === 'semana' && styles.periodoAtivo]}>Semana</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriodoAtivo('mes')}><Text style={[styles.periodoTexto, periodoAtivo === 'mes' && styles.periodoAtivo]}>Mês</Text></TouchableOpacity>
        </View>
        <Text style={styles.cardPrincipalValor}>R$ {saldoAtual.valor.toFixed(2).replace('.', ',')}</Text>
        <View style={styles.entradasSaidasContainer}>
          <View style={styles.entradasSaidasBox}><Text style={styles.entradasLabel}>Entradas</Text><Text style={styles.entradasValor}>R$ {saldoAtual.entradas.toFixed(2).replace('.', ',')}</Text></View>
          <View style={styles.entradasSaidasBox}><Text style={styles.saidasLabel}>Saídas</Text><Text style={styles.saidasValor}>R$ {saldoAtual.saidas.toFixed(2).replace('.', ',')}</Text></View>
        </View>
      </View>

      {/* Card do Gráfico - AQUI ESTÁ A CORREÇÃO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Composição das Entradas ({periodoAtivo.charAt(0).toUpperCase() + periodoAtivo.slice(1)})</Text>
        <View style={styles.graficoContainer}>
          {temDadosParaGrafico ? (
            <PieChart
              data={dadosGraficoAtual}
              width={screenWidth - 40} // LARGURA DA TELA MENOS O PADDING DO CONTAINER
              height={220}
              chartConfig={chartConfig}
              accessor={"valor"}
              backgroundColor={"transparent"}
              paddingLeft={"15"} // Um padding fixo e seguro
              // Removido o 'center' para deixar a biblioteca calcular
              absolute
            />
          ) : (
            <Text style={styles.semDadosTexto}>Sem dados de entrada para este período.</Text>
          )}
        </View>
      </View>

      {/* Resto dos cards - Sem alterações */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Últimos Lançamentos</Text>
        {dadosDashboard.ultimosLancamentos.map((item) => (
          <View key={item.id} style={styles.lancamentoItem}>
            <Text style={styles.lancamentoDescricao}>{item.descricao}</Text>
            <Text style={item.tipo === 'Entrada' ? styles.lancamentoValorEntrada : styles.lancamentoValorSaida}>
              {item.tipo === 'Saida' ? '- R$' : 'R$'} {Math.abs(item.valor).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        ))}
      </View>
      <View>
        <TouchableOpacity style={styles.buttonVoltar} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(1, 67, 70, 1)',
    paddingHorizontal: 20, // Padding horizontal do container principal
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
    // Não precisa mais do alignItems, pois o cálculo da largura vai cuidar disso
  },
  semDadosTexto: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 80, // Para ocupar o espaço do gráfico
  },
  lancamentoItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  lancamentoDescricao: { fontSize: 16, color: '#fff' },
  lancamentoValorEntrada: { fontSize: 16, color: '#2ecc71', fontWeight: 'bold' },
  lancamentoValorSaida: { fontSize: 16, color: '#e74c3c', fontWeight: 'bold' },

    buttonVoltar: {
    width: '100%',
    height: 50,
    backgroundColor: '#c0392b', // Cor um pouco diferente para o Voltar/Cancelar
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
});

export default Dashboard;
