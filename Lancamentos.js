// Arquivo: Lancamentos.js
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
    SafeAreaView,
    ActivityIndicator,
    ScrollView 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://192.168.0.164:3001';

const Lancamentos = () => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [lancamentosData, setLancamentosData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  
  // Estado para o filtro
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  
  // Estados do formulário
  const [categoria, setCategoria] = useState('Venda de Serviço');
  const [tipo, setTipo] = useState('Entrada');
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null); 
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  // Listas do catálogo
  const [servicosList, setServicosList] = useState([]);
  const [produtosList, setProdutosList] = useState([]);
  const [despesasList, setDespesasList] = useState([]);

  // Busca lançamentos com base no filtro
  const fetchLancamentos = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/lancamentos`;
      if (filtroCategoria !== 'Todos') {
        url += `?categoria=${encodeURIComponent(filtroCategoria)}`; 
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setLancamentosData(data.data);
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os lançamentos.');
    } finally {
      setLoading(false);
    }
  }, [filtroCategoria]); // Roda de novo se o filtroCategoria mudar

  // Busca dados do catálogo
  const fetchCatalogo = async () => {
    try {
      const [servicosRes, produtosRes, despesasRes] = await Promise.all([
        fetch(`${API_URL}/servicos`),
        fetch(`${API_URL}/produtos`),
        fetch(`${API_URL}/despesas`),
      ]);
      const servicos = await servicosRes.json();
      const produtos = await produtosRes.json();
      const despesas = await despesasRes.json();

      if (servicos.success) setServicosList(servicos.data);
      if (produtos.success) setProdutosList(produtos.data);
      if (despesas.success) setDespesasList(despesas.data);
      
    } catch (error) {
      console.error('Erro ao buscar catálogo:', error);
    }
  };

  useEffect(() => {
    fetchLancamentos();
  }, [fetchLancamentos]);

  useEffect(() => {
    fetchCatalogo();
  }, []); // Busca catálogo só uma vez

  // Limpa o formulário
  const cleanForm = () => {
    setEditingItem(null);
    setCategoria('Venda de Serviço');
    setTipo('Entrada');
    setItemSelecionadoId(null);
    setDescricao('');
    setValor('');
    setFormaPagamento('Dinheiro');
  };

  // Ajusta o formulário quando a Categoria muda
  useEffect(() => {
    if (!modalVisivel) return;
    
    // Reseta item, descrição e valor (a menos que esteja editando)
    if (!editingItem) {
      setItemSelecionadoId(null);
      setDescricao('');
      setValor('');
    }

    if (categoria === 'Venda de Serviço' || categoria === 'Venda de Produto') {
      setTipo('Entrada');
      if (!editingItem) setFormaPagamento('Dinheiro');
    } else if (categoria === 'Despesa') {
      setTipo('Saída');
      setFormaPagamento('');
    }
  }, [categoria, modalVisivel, editingItem]);

  // Atualiza descrição e valor quando um item do catálogo é selecionado
  const handleItemCatalogSelection = (itemId) => {
    setItemSelecionadoId(itemId);
    if (!itemId) {
      setDescricao('');
      setValor('');
      return;
    }

    let item;
    if (categoria === 'Venda de Serviço') {
      item = servicosList.find(s => s.id === itemId);
      setDescricao(item?.nome_servico || '');
      setValor(String(item?.preco || ''));
    } else if (categoria === 'Venda de Produto') {
      item = produtosList.find(p => p.id === itemId);
      setDescricao(item?.nome_produto || '');
      setValor(String(item?.preco_venda || ''));
    } else if (categoria === 'Despesa') {
      item = despesasList.find(d => d.id === itemId);
      setDescricao(item?.descricao || '');
      setValor(String(item?.valor || ''));
    }
  };

  // Salva (Cria ou Edita) um lançamento
  const handleSalvarLancamento = async () => {
    if (!descricao || !valor) {
      Alert.alert('Erro', 'Descrição e Valor são obrigatórios.');
      return;
    }

    const method = editingItem ? 'PUT' : 'POST';
    const endpoint = editingItem ? `${API_URL}/lancamentos/${editingItem.id}` : `${API_URL}/lancamentos`;

    const body = {
      tipo: tipo,
      categoria: categoria,
      descricao: descricao,
      valor: parseFloat(valor),
      forma_pagamento: formaPagamento,
      id_servico_vendido: categoria === 'Venda de Serviço' ? itemSelecionadoId : null,
      id_produto_vendido: categoria === 'Venda de Produto' ? itemSelecionadoId : null,
    };
    
    if (body.categoria === 'Despesa') {
      body.forma_pagamento = null;
    }

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message);
        setModalVisivel(false);
        cleanForm();
        fetchLancamentos();
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  // Abre o modal para edição
  const handleShowEditModal = (item) => {
    setEditingItem(item);
    setCategoria(item.categoria);
    setTipo(item.tipo);
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setFormaPagamento(item.forma_pagamento);
    setItemSelecionadoId(item.id_servico_vendido || item.id_produto_vendido || null);
    setModalVisivel(true);
  };

  // Exclui um item
  const handleDeleteItem = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este lançamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/lancamentos/${id}`, { method: 'DELETE' });
              const data = await response.json();
              if (response.ok) {
                Alert.alert('Sucesso', data.message);
                fetchLancamentos();
              } else {
                Alert.alert('Erro', data.message);
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          } 
        }
      ]
    );
  };

  // Renderiza o item da lista principal
  const renderLancamentoItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCellDesc}>
        <Text style={styles.itemDescricao}>{item.descricao}</Text>
        <Text style={styles.itemCategoria}>{item.categoria} ({item.forma_pagamento || 'N/A'})</Text>
        <Text style={styles.itemData}>{new Date(item.data_lancamento).toLocaleDateString('pt-BR')}</Text>
      </View>
      <View style={styles.tableCellValor}>
        <Text style={item.tipo === 'Entrada' ? styles.itemValorEntrada : styles.itemValorSaida}>
          {item.tipo === 'Entrada' ? '+' : '-'} R$ {parseFloat(item.valor).toFixed(2)}
        </Text>
      </View>
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

  // Renderiza o seletor de item (Serviço, Produto ou Despesa)
  const renderItemPicker = () => {
    let pickerData = [];
    let label = "";

    if (categoria === 'Venda de Serviço') {
      pickerData = servicosList;
      label = "Selecione um Serviço";
    } else if (categoria === 'Venda de Produto') {
      pickerData = produtosList;
      label = "Selecione um Produto";
    } else if (categoria === 'Despesa') {
      pickerData = despesasList;
      label = "Selecione uma Despesa Padrão";
    }

    return (
      <>
        <Text style={styles.pickerLabel}>{label} (Opcional)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={itemSelecionadoId}
            onValueChange={(itemValue) => handleItemCatalogSelection(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={`-- ${label} --`} value={null} />
            {pickerData.map(item => (
              <Picker.Item 
                key={item.id} 
                label={item.nome_servico || item.nome_produto || item.descricao} 
                value={item.id} 
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.pickerLabel}>Ou digite manualmente:</Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- MODAL DE ADICIONAR/EDITAR --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingItem ? 'Editar' : 'Novo'} Lançamento</Text>

            <Text style={styles.pickerLabel}>Categoria</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
                enabled={!editingItem} // Desabilita se estiver editando
              >
                <Picker.Item label="Venda de Serviço" value="Venda de Serviço" />
                <Picker.Item label="Venda de Produto" value="Venda de Produto" />
                <Picker.Item label="Despesa" value="Despesa" />
              </Picker>
            </View>

            {/* Seletor de Item do Catálogo (só aparece se não estiver editando) */}
            {!editingItem && renderItemPicker()}

            <TextInput 
              style={styles.input} 
              placeholder="Descrição" 
              placeholderTextColor="#999" 
              value={descricao} 
              onChangeText={setDescricao} 
              editable={!itemSelecionadoId || !!editingItem} // Só edita se for manual ou se estiver editando
            />
            <TextInput 
              style={styles.input} 
              placeholder="Valor" 
              placeholderTextColor="#999" 
              keyboardType="numeric" 
              value={valor} 
              onChangeText={setValor} 
            />

            {/* Seletor de Forma de Pagamento (só aparece para Entradas) */}
            {tipo === 'Entrada' && (
              <>
                <Text style={styles.pickerLabel}>Forma de Pagamento</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formaPagamento}
                    onValueChange={(itemValue) => setFormaPagamento(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Dinheiro" value="Dinheiro" />
                    <Picker.Item label="PIX" value="PIX" />
                    <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                    <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                  </Picker>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.buttonSalvar} onPress={handleSalvarLancamento}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancelar} onPress={() => {
              setModalVisivel(false);
              cleanForm();
            }}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* --- TELA PRINCIPAL --- */}
      <Text style={styles.title}>Lançamentos</Text>
      
      {/* --- FILTRO DE CATEGORIA --- */}
      <Text style={styles.pickerLabelFiltro}>Filtrar por Categoria:</Text>
      <View style={styles.pickerContainerFiltro}>
        <Picker
          selectedValue={filtroCategoria}
          onValueChange={(itemValue) => setFiltroCategoria(itemValue)}
          style={styles.pickerFiltro}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Mostrar Todos" value="Todos" />
          <Picker.Item label="Venda de Serviço" value="Venda de Serviço" />
          <Picker.Item label="Venda de Produto" value="Venda de Produto" />
          <Picker.Item label="Despesa" value="Despesa" />
        </Picker>
      </View>
      
      <View style={styles.box}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <FlatList 
            data={lancamentosData}
            renderItem={renderLancamentoItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.semDadosTexto}>Nenhum lançamento encontrado.</Text>}
          />
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => {
        cleanForm();
        setModalVisivel(true);
      }}>
        <Text style={styles.buttonText}>Adicionar Lançamento</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(1, 67, 70, 1)',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    alignSelf: 'center',
  },
  
  // Estilos do Filtro
  pickerLabelFiltro: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerContainerFiltro: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 15,
  },
  pickerFiltro: {
    width: '100%',
    height: 50,
    color: '#fff',
  },
  
  box: {
    width: '100%',
    backgroundColor: 'rgba(0, 107, 111, 0.87)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flex: 1, 
    elevation: 5,
  },
  // Estilos da Linha da Lista
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableCellDesc: {
    flex: 3,
  },
  itemDescricao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCategoria: {
    color: '#ddd',
    fontSize: 12,
  },
  itemData: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },
  tableCellValor: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  itemValorEntrada: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemValorSaida: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 10,
  },
  actionTextEdit: {
    color: '#68c8f0',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
  actionTextDelete: {
    color: '#f07a68',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
  semDadosTexto: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#003a38ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    marginBottom: 10, 
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // Estilos do Modal
  modalScrollContainer: {
    flexGrow: 1,
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
    marginTop: 50,
    marginBottom: 50,
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
  pickerLabel: {
    fontSize: 14,
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
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
  }
});

export default Lancamentos;