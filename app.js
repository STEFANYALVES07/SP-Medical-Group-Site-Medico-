const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');


// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
host: 'localhost',
user: 'phpmyadmin',
password: '0z0x0c0v0b0n0m',
database: 'spmedicalgroupdb',
});

db.connect((err) => {
if (err) {
console.error('Erro ao conectar ao banco de dados:', err);
throw err;
}
console.log('Conexão com o banco de dados MySQL estabelecida.');
});

// Configurar a sessão
app.use(
session({
secret: '0z0x0c0v0b0n0m',
resave: true,
saveUninitialized: true,
})
);
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');
// Rota para a página de login
app.get('/', (req, res) => {
res.render('index');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/'));
});

app.get('/login', (req, res) => {
    res.render('login'); // Renders views/login.ejs
  });
// Rota para processar o formulário de login
app.post('/login', (req, res) => {
const { username, password } = req.body;

const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

db.query(query, [username, password], (err, results) => {
if (err) throw err;

if (results.length > 0) {
req.session.loggedin = true;
req.session.username = username;
res.redirect('/dashboard');
} else {
res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
}
});
});

// Rota para a página do painel
app.get('/dashboard', (req, res) => {

if (req.session.loggedin) {
res.send(`Bem-vindo, ${req.session.username}!<br><a href="/agendamento">Entrar na sua página</a><br><a href="/logout">Sair</a>`);
res.sendFile(__dirname + 'view/index');
app.use(express.static(__dirname + '/IMAGENS'));
} else {
res.send('Faça login para acessar esta página. <a href="/">Login</a>');
}
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
req.session.destroy(() => {
res.redirect('/');
});
});

app.get('/agendamento', (req, res) => {
  res.render('agendamento');
});

app.get('/Cadastro', (req, res) => {
    res.render('Cadastro');
  });
  
  app.post('/Cadastro', (req, res) => {
    const {nomecompleto, cpf, datanascimento, sexo, username, password, email} = req.body;
  
    const query = 'INSERT INTO users (nomecompleto, cpf, datanascimento, sexo, username, password, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nomecompleto, cpf, datanascimento, sexo, username, password, email], (err, results) => {
      if (err) {
        console.error('Erro ao inserir usuário:', err);
        res.send('Erro ao cadastrar o usuário.');
      } else {
        res.redirect('/Carregamento');
      }
    });
  });
  

  app.get('/Carregamento', (req, res) => {
    res.render('Carregamento');
  });

app.listen(8321, () => {
console.log('Servidor rodando na porta 8321');
});
