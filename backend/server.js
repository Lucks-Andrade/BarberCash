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
  host: '127.0.0.1',          // Ou o IP do seu servidor MySQL
  user: 'root',               // Seu usuário do MySQL (geralmente 'root')
  password: '1234', // Sua senha do MySQL
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


// 5. Iniciar o servidor
const PORT = 3306; // A porta que a API vai usar
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});
