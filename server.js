// server.js
const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = 3000;

// --- Configuração do LiveReload ---
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLivereload());

// Permite acessar: http://localhost:3000/pages/home.html
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static(path.join(__dirname, 'public')));

// --- Rotas Específicas ---

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Página não encontrada</h1>
        <p>O arquivo que você tentou acessar não existe.</p>
        <a href="/">Voltar para o Login</a>
    `);
});

app.listen(PORT, () => {
  console.log(`✅ Front-end rodando em: http://localhost:${PORT}`);
  console.log(`📂 Servindo arquivos da pasta: ${path.join(__dirname, 'public')}`);
});