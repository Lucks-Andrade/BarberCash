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
  database: 'barbercash_db'   
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// 4. Criar uma rota de teste
app.get('/', (req, res ) => {
  res.send('API do BarberCash está funcionando!');
});

// --- ROTAS DE USUÁRIO (Sem alteração) ---
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

// --- ROTAS DE SERVIÇOS ---

// Buscar todos (GET) - Sem alteração
app.get('/servicos', (req, res) => {
  const query = 'SELECT * FROM servicos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar serviços.' });
    }
    res.json({ success: true, data: results });
  });
});

// Adicionar novo (POST) - Sem alteração
app.post('/servicos', (req, res) => {
  const { nome_servico, preco, descricao } = req.body;
  if (!nome_servico || preco === undefined || !descricao) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios para Serviço.' });
  }
  const query = 'INSERT INTO servicos (nome_servico, preco, descricao) VALUES (?, ?, ?)';
  db.query(query, [nome_servico, parseFloat(preco), descricao], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar serviço:', err);
      return res.status(500).json({ success: false, message: 'Erro ao adicionar serviço.' });
    }
    res.status(201).json({ success: true, message: 'Serviço adicionado com sucesso!', id: result.insertId });
  });
});

// <<< INÍCIO DAS NOVAS ROTAS DE SERVIÇOS >>>

// Rota para ATUALIZAR (Editar) um serviço
app.put('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const { nome_servico, preco, descricao } = req.body;

  if (!nome_servico || preco === undefined || !descricao) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }

  const query = 'UPDATE servicos SET nome_servico = ?, preco = ?, descricao = ? WHERE id = ?';
  db.query(query, [nome_servico, parseFloat(preco), descricao, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar serviço:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar serviço.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
    }
    res.json({ success: true, message: 'Serviço atualizado com sucesso!' });
  });
});

// Rota para EXCLUIR um serviço
app.delete('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM servicos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir serviço:', err);
      return res.status(500).json({ success: false, message: 'Erro ao excluir serviço.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
    }
    res.json({ success: true, message: 'Serviço excluído com sucesso!' });
  });
});

// <<< FIM DAS NOVAS ROTAS DE SERVIÇOS >>>


// --- ROTAS DE PRODUTOS ---

// Buscar todos (GET) - Sem alteração
app.get('/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
    }
    res.json({ success: true, data: results });
  });
});

// Adicionar novo (POST) - Sem alteração
app.post('/produtos', (req, res) => {
  const { nome_produto, preco_venda, quantidade_estoque, descricao } = req.body;
  if (!nome_produto || preco_venda === undefined || quantidade_estoque === undefined || !descricao) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios para Produto.' });
  }
  const query = 'INSERT INTO produtos (nome_produto, preco_venda, quantidade_estoque, descricao) VALUES (?, ?, ?, ?)';
  db.query(query, [nome_produto, parseFloat(preco_venda), parseInt(quantidade_estoque), descricao], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar produto:', err);
      return res.status(500).json({ success: false, message: 'Erro ao adicionar produto.' });
    }
    res.status(201).json({ success: true, message: 'Produto adicionado com sucesso!', id: result.insertId });
  });
});


// <<< INÍCIO DAS NOVAS ROTAS DE PRODUTOS >>>

// Rota para ATUALIZAR (Editar) um produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome_produto, preco_venda, quantidade_estoque, descricao } = req.body;

  if (!nome_produto || preco_venda === undefined || quantidade_estoque === undefined || !descricao) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }

  const query = 'UPDATE produtos SET nome_produto = ?, preco_venda = ?, quantidade_estoque = ?, descricao = ? WHERE id = ?';
  db.query(query, [nome_produto, parseFloat(preco_venda), parseInt(quantidade_estoque), descricao, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar produto.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    res.json({ success: true, message: 'Produto atualizado com sucesso!' });
  });
});

// Rota para EXCLUIR um produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM produtos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir produto:', err);
      return res.status(500).json({ success: false, message: 'Erro ao excluir produto.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    res.json({ success: true, message: 'Produto excluído com sucesso!' });
  });
});

// <<< FIM DAS NOVAS ROTAS DE PRODUTOS >>>


// --- ROTAS DE DESPESAS ---

// Buscar todas (GET) - Sem alteração
app.get('/despesas', (req, res) => {
  const query = 'SELECT * FROM despesas';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar despesas.' });
    }
    res.json({ success: true, data: results });
  });
});

// Adicionar nova (POST) - Sem alteração
app.post('/despesas', (req, res) => {
  const { descricao, valor } = req.body;
  if (!descricao || valor === undefined) {
    return res.status(400).json({ success: false, message: 'Descrição e valor são obrigatórios para Despesa.' });
  }
  const query = 'INSERT INTO despesas (descricao, valor) VALUES (?, ?)';
  db.query(query, [descricao, parseFloat(valor)], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar despesa:', err);
      return res.status(500).json({ success: false, message: 'Erro ao adicionar despesa.' });
    }
    res.status(201).json({ success: true, message: 'Despesa adicionada com sucesso!', id: result.insertId });
  });
});

// <<< INÍCIO DAS NOVAS ROTAS DE DESPESAS >>>

// Rota para ATUALIZAR (Editar) uma despesa
app.put('/despesas/:id', (req, res) => {
  const { id } = req.params;
  const { descricao, valor } = req.body;

  if (!descricao || valor === undefined) {
    return res.status(400).json({ success: false, message: 'Descrição e valor são obrigatórios.' });
  }

  const query = 'UPDATE despesas SET descricao = ?, valor = ? WHERE id = ?';
  db.query(query, [descricao, parseFloat(valor), id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar despesa:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar despesa.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    }
    res.json({ success: true, message: 'Despesa atualizada com sucesso!' });
  });
});

// Rota para EXCLUIR uma despesa
app.delete('/despesas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM despesas WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir despesa:', err);
      return res.status(500).json({ success: false, message: 'Erro ao excluir despesa.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    }
    res.json({ success: true, message: 'Despesa excluída com sucesso!' });
  });
});

// <<< FIM DAS NOVAS ROTAS DE DESPESAS >>>


// 5. Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});