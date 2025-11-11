import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    FlatList, 
    Modal,
    TextInput,
    Alert,
} from 'react-native';

const API_URL = 'http://10.0.2.2:3001';

const Lancamento = ({ navigation }) => {
  const [abaAtiva, setAbaAtiva] = useState('Serviços');
  const [modalVisivel, setModalVisivel] = useState(false);
  
  // Estados para os dados do formulário
  const [nomeServico, setNomeServico] = useState('');
  const [precoServico, setPrecoServico] = useState('');
  const [descricaoServico, setDescricaoServico] = useState('');
  
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoVendaProduto, setPrecoVendaProduto] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');

  const [descricaoDespesa, setDescricaoDespesa] = useState('');
  const [valorDespesa, setValorDespesa] = useState('');

  // Estados para a lista de itens
  const [servicosData, setServicosData] = useState([]);
  const [produtosData, setProdutosData] = useState([]);
  const [despesasData, setDespesasData] = useState([]);

  const cleanForm = () => {
    setNomeServico('');
    setPrecoServico('');
    setDescricaoServico('');
    setNomeProduto('');
    setPrecoVendaProduto('');
    setQuantidadeEstoque('');
    setDescricaoProduto('');
    setDescricaoDespesa('');
    setValorDespesa('');
  }

  // Função para buscar dados da API
  const fetchData = useCallback(async () => {
    try {
      const [servicosRes, produtosRes, despesasRes] = await Promise.all([
        fetch(`${API_URL}/servicos`),
        fetch(`${API_URL}/produtos`),
        fetch(`${API_URL}/despesas`),
      ]);

      const servicosData = await servicosRes.json();
      const produtosData = await produtosRes.json();
      const despesasData = await despesasRes.json();

      if (servicosData.success) setServicosData(servicosData.data);
      if (produtosData.success) setProdutosData(produtosData.data);
      if (despesasData.success) setDespesasData(despesasData.data);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Verifique a conexão com o servidor.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSalvarLancamento = async () => {
    let endpoint = '';
    let body = {};
    
    // Lógica para escolher o endpoint e os dados com base na aba ativa
    if (abaAtiva === 'Serviços') {
      if (!nomeServico || !precoServico || !descricaoServico) {
        Alert.alert('Erro', 'Preencha todos os campos!');
        return;
      }
      endpoint = '/servicos';
      body = {
        nome_servico: nomeServico,
        preco: parseFloat(precoServico),
        descricao: descricaoServico
      };
    } else if (abaAtiva === 'Produtos') {
      if (!nomeProduto || !precoVendaProduto || !quantidadeEstoque || !descricaoProduto) {
        Alert.alert('Erro', 'Preencha todos os campos!');
        return;
      }
      endpoint = '/produtos';
      body = {
        nome_produto: nomeProduto,
        preco_venda: parseFloat(precoVendaProduto),
        quantidade_estoque: parseInt(quantidadeEstoque),
        descricao: descricaoProduto
      };
    } else if (abaAtiva === 'Despesas') {
      if (!descricaoDespesa || !valorDespesa) {
        Alert.alert('Erro', 'Preencha todos os campos!');
        return;
      }
      endpoint = '/despesas';
      body = {
        descricao: descricaoDespesa,
        valor: parseFloat(valorDespesa)
      };
    }
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message);
        setModalVisivel(false);
        cleanForm(); // Limpa o formulário
        fetchData(); // Recarrega a lista de itens após o sucesso
      } else {
        Alert.alert('Erro', data.message || 'Erro ao salvar lançamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando.');
    }
  };

  const renderFormFields = () => {
    switch (abaAtiva) {
      case 'Serviços':
        return (
          <>
            <TextInput style={styles.input} placeholder="Nome do Serviço" placeholderTextColor="#999" value={nomeServico} onChangeText={setNomeServico} />
            <TextInput style={styles.input} placeholder="Preço" placeholderTextColor="#999" keyboardType="numeric" value={precoServico} onChangeText={setPrecoServico} />
            <TextInput style={styles.input} placeholder="Descrição" placeholderTextColor="#999" value={descricaoServico} onChangeText={setDescricaoServico} />
          </>
        );
      case 'Produtos':
        return (
          <>
            <TextInput style={styles.input} placeholder="Nome do Produto" placeholderTextColor="#999" value={nomeProduto} onChangeText={setNomeProduto} />
            <TextInput style={styles.input} placeholder="Preço de Venda" placeholderTextColor="#999" keyboardType="numeric" value={precoVendaProduto} onChangeText={setPrecoVendaProduto} />
            <TextInput style={styles.input} placeholder="Quantidade em Estoque" placeholderTextColor="#999" keyboardType="numeric" value={quantidadeEstoque} onChangeText={setQuantidadeEstoque} />
            <TextInput style={styles.input} placeholder="Descrição" placeholderTextColor="#999" value={descricaoProduto} onChangeText={setDescricaoProduto} />
          </>
        );
      case 'Despesas':
        return (
          <>
            <TextInput style={styles.input} placeholder="Descrição da Despesa" placeholderTextColor="#999" value={descricaoDespesa} onChangeText={setDescricaoDespesa} />
            <TextInput style={styles.input} placeholder="Valor" placeholderTextColor="#999" keyboardType="numeric" value={valorDespesa} onChangeText={setValorDespesa} />
          </>
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.nome_servico || item.nome_produto || item.descricao}</Text>
      <Text style={styles.tableCell}>{item.preco || item.preco_venda || item.valor}</Text>
    </View>
  );

  const getHeader = () => {
    if (abaAtiva === 'Serviços') return ['Serviço', 'Preço'];
    if (abaAtiva === 'Produtos') return ['Produto', 'Preço'];
    if (abaAtiva === 'Despesas') return ['Descrição', 'Valor'];
    return [];
  }

  const header = getHeader();

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Adicionar {abaAtiva.slice(0, -1)}</Text>
            {renderFormFields()}
            <TouchableOpacity style={styles.buttonSalvar} onPress={handleSalvarLancamento}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancelar} onPress={() => setModalVisivel(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Lançamentos</Text>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, abaAtiva === 'Serviços' && styles.tabAtiva]} onPress={() => setAbaAtiva('Serviços')}>
          <Text style={styles.tabText}>Serviços</Text>
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
        {abaAtiva === 'Serviços' && <FlatList data={servicosData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
        {abaAtiva === 'Produtos' && <FlatList data={produtosData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
        {abaAtiva === 'Despesas' && <FlatList data={despesasData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisivel(true)}>
        <Text style={styles.buttonText}>Adicionar Novo {abaAtiva.slice(0, -1)}</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    minHeight: 200,
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
    backgroundColor: '#c0392b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    color: '#333',
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