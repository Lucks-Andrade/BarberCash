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
// Este import não está sendo usado, mas pode deixar aí sem problemas
import { ScrollView } from 'react-native-gesture-handler'; 

const API_URL = 'http://10.0.2.2:3001';

const Catalogo = ({ navigation }) => { // <<< NOME ALTERADO (correto)
  const [abaAtiva, setAbaAtiva] = useState('Serviços');
  const [modalVisivel, setModalVisivel] = useState(false);
  
  // <<< NOVO ESTADO >>>
  // Guarda o item que está sendo editado. Se for 'null', estamos criando um novo.
  const [editingItem, setEditingItem] = useState(null); 
  
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

  // <<< FUNÇÃO ALTERADA >>>
  // Limpa o formulário e também reseta o item em edição
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
    setEditingItem(null); // <<< ADICIONADO
  }

  // Função para buscar dados da API (sem alteração)
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

  // <<< FUNÇÃO ALTERADA >>>
  // Agora ela decide se faz POST (criar) ou PUT (editar)
  const handleSalvarLancamento = async () => {
    let endpoint = '';
    let body = {};
    let method = editingItem ? 'PUT' : 'POST'; // <<< ALTERADO: Define o método
    
    // Lógica para escolher o endpoint e os dados com base na aba ativa
    if (abaAtiva === 'Serviços') {
      if (!nomeServico || !precoServico || !descricaoServico) {
        Alert.alert('Erro', 'Preencha todos os campos!');
        return;
      }
      // <<< ALTERADO: Se editingItem existir, adiciona o ID no endpoint
      endpoint = editingItem ? `/servicos/${editingItem.id}` : '/servicos';
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
      endpoint = editingItem ? `/produtos/${editingItem.id}` : '/produtos';
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
      endpoint = editingItem ? `/despesas/${editingItem.id}` : '/despesas';
      body = {
        descricao: descricaoDespesa,
        valor: parseFloat(valorDespesa)
      };
    }
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: method, // <<< ALTERADO: Usa o método dinâmico
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // <<< ALTERADO: Mensagem dinâmica
        Alert.alert('Sucesso', editingItem ? 'Item atualizado com sucesso!' : 'Item salvo com sucesso!');
        setModalVisivel(false);
        cleanForm(); // Limpa o formulário e reseta o editingItem
        fetchData(); // Recarrega a lista de itens após o sucesso
      } else {
        Alert.alert('Erro', data.message || 'Erro ao salvar lançamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando.');
    }
  };

  // <<< NOVA FUNÇÃO >>>
  // Prepara o modal para edição
  const handleShowEditModal = (item) => {
    setEditingItem(item); // Define o item que estamos editando
    
    // Preenche os campos do formulário com os dados do item
    if (abaAtiva === 'Serviços') {
      setNomeServico(item.nome_servico);
      setPrecoServico(String(item.preco)); // Converte para string para o TextInput
      setDescricaoServico(item.descricao);
    } else if (abaAtiva === 'Produtos') {
      setNomeProduto(item.nome_produto);
      setPrecoVendaProduto(String(item.preco_venda));
      setQuantidadeEstoque(String(item.quantidade_estoque));
      setDescricaoProduto(item.descricao);
    } else if (abaAtiva === 'Despesas') {
      setDescricaoDespesa(item.descricao);
      setValorDespesa(String(item.valor));
    }
    
    setModalVisivel(true); // Abre o modal
  };

  // <<< NOVA FUNÇÃO >>>
  // Lida com a exclusão de um item
  const handleDeleteItem = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            let endpoint = '';
            if (abaAtiva === 'Serviços') endpoint = `/servicos/${id}`;
            else if (abaAtiva === 'Produtos') endpoint = `/produtos/${id}`;
            else if (abaAtiva === 'Despesas') endpoint = `/despesas/${id}`;

            try {
              const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
              const data = await response.json();
              
              if (response.ok) {
                Alert.alert('Sucesso', data.message);
                fetchData(); // Recarrega os dados
              } else {
                Alert.alert('Erro', data.message);
              }
            } catch (error) {
              console.error('Erro de rede ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
            }
          } 
        }
      ]
    );
  };

  // Formulário do Modal (sem alteração)
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

  // <<< FUNÇÃO ALTERADA >>>
  // Adiciona os botões de Editar e Excluir
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      {/* Células de Texto */}
      <Text style={styles.tableCell}>{item.nome_servico || item.nome_produto || item.descricao}</Text>
      <Text style={styles.tableCellValor}>R$ {parseFloat(item.preco || item.preco_venda || item.valor).toFixed(2)}</Text>
      
      {/* Célula de Ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleShowEditModal(item)}>
          <Text style={styles.actionTextEdit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <Text style={styles.actionTextDelete}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // <<< FUNÇÃO ALTERADA >>>
  // Adiciona a coluna "Ações"
  const getHeader = () => {
    if (abaAtiva === 'Serviços') return ['Serviço', 'Preço', 'Ações'];
    if (abaAtiva === 'Produtos') return ['Produto', 'Preço', 'Ações'];
    if (abaAtiva === 'Despesas') return ['Descrição', 'Valor', 'Ações'];
    return [];
  }

  const header = getHeader();

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        // <<< ALTERADO: Limpa o form ao fechar >>>
        onRequestClose={() => {
          setModalVisivel(false);
          cleanForm(); 
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* <<< TÍTULO ALTERADO >>> */}
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar' : 'Adicionar'} {abaAtiva.slice(0, -1)}
            </Text>
            {renderFormFields()}
            <TouchableOpacity style={styles.buttonSalvar} onPress={handleSalvarLancamento}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            {/* <<< BOTÃO ALTERADO: Limpa o form ao cancelar >>> */}
            <TouchableOpacity style={styles.buttonCancelar} onPress={() => {
              setModalVisivel(false);
              cleanForm();
            }}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Catálogo</Text>
      
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
        {/* <<< HEADER ALTERADO (3 colunas) >>> */}
        <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>{header[0]}</Text>
            <Text style={styles.tableHeaderCellValor}>{header[1]}</Text>
            <Text style={styles.tableHeaderCellAcoes}>{header[2]}</Text>
        </View>
        {abaAtiva === 'Serviços' && <FlatList data={servicosData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
        {abaAtiva === 'Produtos' && <FlatList data={produtosData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
        {abaAtiva === 'Despesas' && <FlatList data={despesasData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
      </View>

      {/* <<< BOTÃO ALTERADO: Garante que o form esteja limpo ao adicionar >>> */}
      <TouchableOpacity style={styles.button} onPress={() => {
        cleanForm(); // Garante que não estamos editando
        setModalVisivel(true);
      }}>
        <Text style={styles.buttonText}>Adicionar Novo {abaAtiva.slice(0, -1)}</Text>
      </TouchableOpacity>

      {/* O botão Voltar não estava no seu Catalogo.js, então eu o removi. */}
      {/* Se quiser ele de volta, descomente a linha abaixo e o estilo .buttonVoltar */}
      {/* <TouchableOpacity style={styles.buttonVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity> */}
    </View>
  );
};

// <<< ESTILOS ALTERADOS E ADICIONADOS >>>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Correção de layout
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
    width: '100%', // Adicionado para consistência
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
    maxHeight: '50%', // Do seu arquivo
    flex: 1, // Do seu arquivo
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    paddingBottom: 10,
    marginBottom: 10,
    justifyContent: 'space-between', // Adicionado
  },
  // <<< ESTILOS DE HEADER ALTERADOS (para 3 colunas) >>>
  tableHeaderCell: { 
    flex: 2.5, // Mais espaço para o nome
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  tableHeaderCellValor: { 
    flex: 1.5, // Espaço para o valor
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
    textAlign: 'left' // Alinha o preço
  },
  tableHeaderCellAcoes: { 
    flex: 2, // Espaço para os 2 botões
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
    textAlign: 'center' // Centraliza o texto "Ações"
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12, // Um pouco mais de espaço
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center', // Alinha botões e texto verticalmente
    justifyContent: 'space-between',
  },
  // <<< ESTILOS DE CÉLULA ALTERADOS (para 3 colunas) >>>
  tableCell: { 
    flex: 2.5, // Descrição ocupa mais espaço
    color: '#fff', 
    fontSize: 14,
    flexWrap: 'wrap', // Quebra de linha se o nome for muito grande
  },
  tableCellValor: {
    flex: 1.5, // Valor
    color: '#fff',
    fontSize: 14,
    textAlign: 'left', // Alinha o preço
  },
  // <<< NOVOS ESTILOS PARA AÇÕES >>>
  actionsContainer: {
    flex: 2, // Ações
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaço entre botões
    alignItems: 'center',
  },
  actionTextEdit: {
    color: '#68c8f0', // Azul claro
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5, // Área de toque maior
  },
  actionTextDelete: {
    color: '#f07a68', // Vermelho claro
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5, // Área de toque maior
  },
  // --- Fim dos estilos de tabela ---
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
  // (Botão Voltar removido conforme seu arquivo)
  // buttonVoltar: { ... },
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
  // (Estilos não utilizados removidos: tipoLancamentoContainer, etc.)
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

export default Catalogo;