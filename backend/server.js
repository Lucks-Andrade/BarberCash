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
//    Quando você acessar http://localhost:3001/ no navegador, verá uma mensagem.
app.get('/', (req, res ) => {
  res.send('API do BarberCash está funcionando!');
});

// Rota para buscar todos os serviços (exemplo)
app.get('/servicos', (req, res) => {
    const query = 'SELECT * FROM Servicos WHERE ativo = TRUE';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar serviços no banco de dados.');
        }
        res.json(results);
    });
});

//ROTA PARA O CADASTRO DE USUÁRIOS
app.post('/usuarios', (req, res) => {
  const {nome, email, senha, telefone} = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({success: false,message: 'Todos os campos são obrigatórios '})
  }

  // CORREÇÃO: Mova a declaração da query para cá
  const query = 'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?,?,?,?)';
    db.query(query, [nome, email, senha, telefone], (err, result) =>{
      if(err){
        console.error('Erro ao cadastrar usuário', err);
        return res.status(500).json({success: false, message: 'Erro ao cadastrar usuário. Tente novamente.'});
      }
      res.status(201).json({success: true, message: 'Usuário cadastrado com sucesso!'});
    });
});

// NOVA ROTA DE LOGIN
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


// 5. Iniciar o servidor
const PORT = 3001; // A porta que a API vai usar
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});