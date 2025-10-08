// 1. Importar as dependências
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 2. Configurar o aplicativo Express
const app = express();
app.use(cors()); // Permite que o frontend acesse a API
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON

// 3. Configurar a conexão com o Banco de Dados
//    (Substitua com os dados do seu MySQL)
const db = mysql.createConnection({
  host: 'localhost',          // Ou o IP do seu servidor MySQL
  user: 'root',               // Seu usuário do MySQL (geralmente 'root')
  password: '', // Sua senha do MySQL
  database: 'barbercash_db'   // O nome do banco de dados que criamos
});

// Tenta conectar ao banco de dados
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

// ROTA PARA O CADASTRO DE USUÁRIOS
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

// ROTA DE LOGIN
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

// ROTAS PARA LANÇAMENTOS (SERVIÇOS, PRODUTOS, DESPESAS)

// Rota para adicionar um novo serviço
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

// Rota para buscar todos os serviços
app.get('/servicos', (req, res) => {
  const query = 'SELECT * FROM servicos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar serviços.' });
    }
    res.json({ success: true, data: results });
  });
});

// Rota para adicionar um novo produto
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

// Rota para buscar todos os produtos
app.get('/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
    }
    res.json({ success: true, data: results });
  });
});

// Rota para adicionar uma nova despesa
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

// Rota para buscar todas as despesas
app.get('/despesas', (req, res) => {
  const query = 'SELECT * FROM despesas';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar despesas.' });
    }
    res.json({ success: true, data: results });
  });
});

// 5. Iniciar o servidor
const PORT = 3001; // A porta que a API vai usar
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});