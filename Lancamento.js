import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    FlatList, 
    Modal, // 1. Importar o Modal
    TextInput, // 2. Importar o TextInput para o formulário
    Alert // Para dar feedback ao usuário
} from 'react-native';

// --- Dados de Exemplo (continuam aqui por enquanto) ---
const despesasData = [
  { id: '1', descricao: 'Cera de Cabelo', valor: 'R$ 25,00' },
  { id: '2', descricao: 'Lâminas de Barbear', valor: 'R$ 15,00' },
];

const produtosData = [
  { id: '1', nome: 'Pomada Modeladora', preco: 'R$ 35,00' },
  { id: '2', nome: 'Óleo para Barba', preco: 'R$ 30,00' },
];

const precosData = [
    { id: '1', servico: 'Corte Masculino', valor: 'R$ 40,00' },
    { id: '2', servico: 'Barba', valor: 'R$ 30,00' },
];


const Lancamento = ({ navigation }) => {
  const [abaAtiva, setAbaAtiva] = useState('Precos');
  
  // --- Estados para o Modal e Formulário ---
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipoLancamento, setTipoLancamento] = useState('Entrada'); // 'Entrada' ou 'Saida'

  const handleSalvarLancamento = () => {
    if (!descricao || !valor) {
      Alert.alert('Erro', 'Por favor, preencha a descrição e o valor.');
      return;
    }
    // Aqui, no futuro, você enviaria os dados para o backend/banco de dados
    console.log({
      tipo: tipoLancamento,
      descricao,
      valor,
    });
    
    Alert.alert('Sucesso!', 'Novo lançamento adicionado.');
    
    // Limpa os campos e fecha o modal
    setDescricao('');
    setValor('');
    setModalVisivel(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.descricao || item.nome || item.servico}</Text>
      <Text style={styles.tableCell}>{item.valor || item.preco}</Text>
    </View>
  );

  const getHeader = () => {
      if (abaAtiva === 'Despesas') return ['Descrição', 'Valor'];
      if (abaAtiva === 'Produtos') return ['Produto', 'Preço'];
      if (abaAtiva === 'Precos') return ['Serviço', 'Valor'];
      return [];
  }

  const header = getHeader();

  return (
    <View style={styles.container}>
      {/* --- Modal para Adicionar Novo Lançamento --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Adicionar Novo Lançamento</Text>

            {/* Seletor de Tipo: Entrada ou Saída */}
            <View style={styles.tipoLancamentoContainer}>
                <TouchableOpacity 
                    style={[styles.tipoButton, tipoLancamento === 'Entrada' && styles.tipoButtonAtivo]}
                    onPress={() => setTipoLancamento('Entrada')}
                >
                    <Text style={styles.tipoButtonText}>Entrada</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tipoButton, tipoLancamento === 'Saida' && styles.tipoButtonAtivo]}
                    onPress={() => setTipoLancamento('Saida')}
                >
                    <Text style={styles.tipoButtonText}>Saída</Text>
                </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Descrição (Ex: Corte, Venda de Pomada)"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              style={styles.input}
              placeholder="Valor (Ex: 40.00)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />

            <TouchableOpacity style={styles.buttonSalvar} onPress={handleSalvarLancamento}>
              <Text style={styles.buttonText}>Salvar Lançamento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCancelar} onPress={() => setModalVisivel(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Conteúdo Principal da Tela --- */}
      <Text style={styles.title}>Lançamentos</Text>

      <View style={styles.tabsContainer}>
        {/* ... (código das abas não muda) ... */}
        <TouchableOpacity style={[styles.tab, abaAtiva === 'Precos' && styles.tabAtiva]} onPress={() => setAbaAtiva('Precos')}>
          <Text style={styles.tabText}>Tabela de Preços</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, abaAtiva === 'Produtos' && styles.tabAtiva]} onPress={() => setAbaAtiva('Produtos')}>
          <Text style={styles.tabText}>Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, abaAtiva === 'Despesas' && styles.tabAtiva]} onPress={() => setAbaAtiva('Despesas')}>
          <Text style={styles.tabText}>Despesas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>{header[0]}</Text>
            <Text style={styles.tableHeaderCell}>{header[1]}</Text>
        </View>
        {abaAtiva === 'Precos' && <FlatList data={precosData} renderItem={renderItem} keyExtractor={(item) => item.id} />}
        {abaAtiva === 'Produtos' && <FlatList data={produtosData} renderItem={renderItem} keyExtractor={(item) => item.id} />}
        {abaAtiva === 'Despesas' && <FlatList data={despesasData} renderItem={renderItem} keyExtractor={(item) => item.id} />}
      </View>
      
      {/* Botão que abre o Modal */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisivel(true)}>
        <Text style={styles.buttonText}>Adicionar Novo Lançamento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Estilos (Adicionei os estilos para o Modal) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 67, 70, 1)',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#003a38ff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabAtiva: { backgroundColor: 'rgba(0, 107, 111, 0.87)' },
  tabText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  box: {
    width: '100%',
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 200, // Altura mínima para a tabela
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderCell: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tableCell: { flex: 1, color: '#fff', fontSize: 14 },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#003a38ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
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
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // --- Estilos do Modal ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escurecido
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  tipoLancamentoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  tipoButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tipoButtonAtivo: {
    backgroundColor: '#006e6bff',
    borderColor: '#003a38ff',
  },
  tipoButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  buttonSalvar: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonCancelar: {
    width: '100%',
    height: 50,
    backgroundColor: '#c0392b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
});

export default Lancamento;
