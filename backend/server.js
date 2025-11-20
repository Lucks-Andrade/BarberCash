// 1. Importar as dependências
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 2. Configurar o aplicativo Express
const app = express();
app.use(cors()); 
app.use(express.json()); 

// 3. Configurar a conexão com o Banco de Dados
const db = mysql.createConnection({
  host: 'localhost',          
  user: 'root',               
  password: '', 
  database: 'barbercash_db',
  charset: 'utf8mb4'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// --- ROTAS DE USUÁRIO E LOGIN ---
app.post('/usuarios', (req, res) => {
  const {nome, email, senha, telefone} = req.body;
  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({success: false,message: 'Todos os campos são obrigatórios '})
  }
  const query = 'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?,?,?,?)';
  db.query(query, [nome, email, senha, telefone], (err, result) =>{
    if(err){
      console.error('Erro ao cadastrar usuário', err);
      return res.status(500).json({success: false, message: 'Erro ao cadastrar usuário. Tente novamente.'});
    }
    res.status(201).json({success: true, message: 'Usuário cadastrado com sucesso!'});
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
  }
  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Erro na consulta de login:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
    if (results.length > 0) {
      res.json({ success: true, message: 'Login realizado com sucesso!' });
    } else {
      res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }
  });
});

// --- ROTAS DE CATÁLOGO (Serviços, Produtos, Despesas) ---

/* SERVIÇOS */
app.get('/servicos', (req, res) => {
  const query = 'SELECT * FROM servicos';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar serviços.' });
    res.json({ success: true, data: results });
  });
});
app.post('/servicos', (req, res) => {
  const { nome_servico, preco, descricao } = req.body;
  const query = 'INSERT INTO servicos (nome_servico, preco, descricao) VALUES (?, ?, ?)';
  db.query(query, [nome_servico, parseFloat(preco), descricao], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar serviço.' });
    res.status(201).json({ success: true, message: 'Serviço adicionado com sucesso!', id: result.insertId });
  });
});
app.put('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const { nome_servico, preco, descricao } = req.body;
  const query = 'UPDATE servicos SET nome_servico = ?, preco = ?, descricao = ? WHERE id = ?';
  db.query(query, [nome_servico, parseFloat(preco), descricao, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar serviço.' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
    res.json({ success: true, message: 'Serviço atualizado com sucesso!' });
  });
});
app.delete('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM servicos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao excluir serviço.' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
    res.json({ success: true, message: 'Serviço excluído com sucesso!' });
  });
});

/* PRODUTOS */
app.get('/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
    res.json({ success: true, data: results });
  });
});
app.post('/produtos', (req, res) => {
  const { nome_produto, preco_venda, quantidade_estoque, descricao } = req.body;
  const query = 'INSERT INTO produtos (nome_produto, preco_venda, quantidade_estoque, descricao) VALUES (?, ?, ?, ?)';
  db.query(query, [nome_produto, parseFloat(preco_venda), parseInt(quantidade_estoque), descricao], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar produto.' });
    res.status(201).json({ success: true, message: 'Produto adicionado com sucesso!', id: result.insertId });
  });
});
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome_produto, preco_venda, quantidade_estoque, descricao } = req.body;
  const query = 'UPDATE produtos SET nome_produto = ?, preco_venda = ?, quantidade_estoque = ?, descricao = ? WHERE id = ?';
  db.query(query, [nome_produto, parseFloat(preco_venda), parseInt(quantidade_estoque), descricao, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar produto.' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    res.json({ success: true, message: 'Produto atualizado com sucesso!' });
  });
});
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM produtos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao excluir produto.' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    res.json({ success: true, message: 'Produto excluído com sucesso!' });
  });
});

/* DESPESAS */
app.get('/despesas', (req, res) => {
  const query = 'SELECT * FROM despesas';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar despesas.' });
    res.json({ success: true, data: results });
  });
});
app.post('/despesas', (req, res) => {
  const { descricao, valor } = req.body;
  const query = 'INSERT INTO despesas (descricao, valor) VALUES (?, ?)';
  db.query(query, [descricao, parseFloat(valor)], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar despesa.' });
    res.status(201).json({ success: true, message: 'Despesa adicionada com sucesso!', id: result.insertId });
  });
});
app.put('/despesas/:id', (req, res) => {
  const { id } = req.params;
  const { descricao, valor } = req.body;
  const query = 'UPDATE despesas SET descricao = ?, valor = ? WHERE id = ?';
  db.query(query, [descricao, parseFloat(valor), id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar despesa.' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    res.json({ success: true, message: 'Despesa atualizada com sucesso!' });
  });
});
app.delete('/despesas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM despesas WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao excluir despesa.' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    res.json({ success: true, message: 'Despesa excluída com sucesso!' });
  });
});


// ----------------------------------------------
// --- ROTAS DE LANÇAMENTOS (TRANSAÇÕES) ---
// ----------------------------------------------

// Rota para CRIAR um novo lançamento
app.post('/lancamentos', (req, res) => {
  const { 
    tipo, 
    descricao, 
    valor, 
    categoria, 
    forma_pagamento, 
    id_servico_vendido, 
    id_produto_vendido 
  } = req.body;

  const data_lancamento = new Date(); 

  const query = `
    INSERT INTO lancamentos 
    (tipo, descricao, valor, data_lancamento, categoria, forma_pagamento, id_servico_vendido, id_produto_vendido) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [
    tipo, 
    descricao, 
    parseFloat(valor), 
    data_lancamento, 
    categoria, 
    // Garante que o valor seja NULL se não for fornecido (para despesas)
    forma_pagamento || null, 
    id_servico_vendido || null, 
    id_produto_vendido || null
  ], (err, result) => {
    if (err) {
      console.error('Erro ao salvar lançamento:', err);
      return res.status(500).json({ success: false, message: 'Erro ao salvar lançamento.' });
    }
    res.status(201).json({ success: true, message: 'Lançamento salvo com sucesso!', id: result.insertId });
  });
});

// Rota para LISTAR lançamentos (com filtros)
app.get('/lancamentos', (req, res) => {
  const { data_inicio, data_fim, categoria } = req.query;

  let query = 'SELECT * FROM lancamentos WHERE 1=1';
  const params = [];

  if (data_inicio && data_fim) {
    query += ' AND data_lancamento BETWEEN ? AND ?';
    params.push(data_inicio, data_fim + ' 23:59:59'); // Inclui o dia todo
  }

  if (categoria && categoria !== 'Todos') { // Adiciona a verificação 'Todos'
    if (Array.isArray(categoria)) {
      query += ` AND categoria IN (?)`;
      params.push(categoria);
    } else {
      query += ' AND categoria = ?';
      params.push(categoria);
    }
  }

  query += ' ORDER BY data_lancamento DESC'; // Mais novos primeiro

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar lançamentos:', err);
      return res.status(500).json({ success: false, message: 'Erro ao buscar lançamentos.' });
    }
    res.json({ success: true, data: results });
  });
});

// Rota para ATUALIZAR (Editar) um lançamento
app.put('/lancamentos/:id', (req, res) => {
  const { id } = req.params;
  const { 
    tipo, 
    descricao, 
    valor, 
    categoria, 
    forma_pagamento, 
    id_servico_vendido, 
    id_produto_vendido 
  } = req.body;

  const query = `
    UPDATE lancamentos SET 
    tipo = ?, 
    descricao = ?, 
    valor = ?, 
    categoria = ?, 
    forma_pagamento = ?, 
    id_servico_vendido = ?, 
    id_produto_vendido = ?
    WHERE id = ?
  `;

  db.query(query, [
    tipo, 
    descricao, 
    parseFloat(valor), 
    categoria, 
    forma_pagamento || null, 
    id_servico_vendido || null, 
    id_produto_vendido || null,
    id
  ], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar lançamento:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar lançamento.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lançamento não encontrado.' });
    }
    res.json({ success: true, message: 'Lançamento atualizado com sucesso!' });
  });
});

// Rota para EXCLUIR um lançamento
app.delete('/lancamentos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM lancamentos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir lançamento:', err);
      return res.status(500).json({ success: false, message: 'Erro ao excluir lançamento.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lançamento não encontrado.' });
    }
    res.json({ success: true, message: 'Lançamento excluído com sucesso!' });
  });
});

// ----------------------------------------------
// --- ROTAS DO DASHBOARD (DINÂMICAS) ---
// ----------------------------------------------

// Função auxiliar para montar a query de data
const getWherePeriodo = (periodo) => {
  switch (periodo) {
    case 'semana':
      return 'YEARWEEK(data_lancamento, 1) = YEARWEEK(CURDATE(), 1)';
    case 'mes':
      return 'MONTH(data_lancamento) = MONTH(CURDATE()) AND YEAR(data_lancamento) = YEAR(CURDATE())';
    case 'dia':
    default:
      return 'DATE(data_lancamento) = CURDATE()';
  }
};

// Rota de Resumo (Saldos) - ATUALIZADA
app.get('/dashboard/resumo', (req, res) => {
  const { periodo } = req.query; // Pega o período (dia, semana, mes)
  const whereClause = getWherePeriodo(periodo); // Monta a cláusula WHERE

  const query = `
    SELECT 
      SUM(CASE WHEN tipo = 'Entrada' THEN valor ELSE 0 END) as entradas,
      SUM(CASE WHEN tipo = 'Saída' THEN valor ELSE 0 END) as saidas,
      SUM(CASE WHEN tipo = 'Entrada' THEN valor ELSE -valor END) as valor
    FROM lancamentos 
    WHERE ${whereClause}
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Erro no resumo:", err);
      return res.status(500).json({ success: false, message: 'Erro ao calcular resumo.' });
    }
    
    const data = {
      entradas: parseFloat(result[0].entradas) || 0,
      saidas: parseFloat(result[0].saidas) || 0,
      valor: parseFloat(result[0].valor) || 0
    };
    
    res.json(data); // Retorna o objeto direto
  });
});

// Rota do Gráfico (Entradas por Categoria) - ATUALIZADA
app.get('/dashboard/entradas-categoria', (req, res) => {
  const { periodo } = req.query; // Pega o período
  const whereClause = getWherePeriodo(periodo); // Monta a cláusula WHERE

  const query = `
    SELECT 
      categoria as nome, 
      SUM(valor) as valor
    FROM lancamentos
    WHERE tipo = 'Entrada' AND ${whereClause} 
    GROUP BY categoria
  `;
  
  const cores = {
    'Venda de Serviço': '#006b6f',
    'Venda de Produto': '#4a90e2',
    'Outras': '#f5a623' // Cor para qualquer outra categoria
  };

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar dados do gráfico.' });
    }
    
    const dataGrafico = results.map(item => ({
      ...item,
      valor: parseFloat(item.valor),
      color: cores[item.nome] || cores['Outras'],
      legendFontColor: '#FFF',
      legendFontSize: 14
    }));

    res.json(dataGrafico);
  });
});

// Rota dos Últimos Lançamentos - ATUALIZADA
app.get('/dashboard/ultimos-lancamentos', (req, res) => {
  const { periodo } = req.query; // Pega o período
  const whereClause = getWherePeriodo(periodo); // Monta a cláusula WHERE
  
  const query = `
    SELECT id, tipo, descricao, valor 
    FROM lancamentos 
    WHERE ${whereClause}
    ORDER BY data_lancamento DESC 
    LIMIT 5
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar últimos lançamentos.' });
    }
    
    const dataFormatada = results.map(item => ({
      ...item,
      valor: parseFloat(item.valor)
    }));
    
    res.json(dataFormatada);
  });
});


// 5. Iniciar o servidor
const PORT = 3001; 
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});