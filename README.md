# Projeto_integrador

# 🚀 Projeto Integrador — Servidor Node.js + Express + LiveReload

Este projeto utiliza **Node.js** e **Express** para servir o frontend de forma dinâmica, com atualização automática no navegador durante o desenvolvimento.

---

## 🧱 O que está funcionando agora

| Recurso | O que faz | Como funciona |
|----------|------------|----------------|
| 🖥️ **Servidor Web (Express)** | Serve arquivos HTML, CSS, JS e imagens da pasta `public/`. | O comando `app.use(express.static('public'))` permite que os arquivos sejam acessados diretamente no navegador. |

| 🔁 **Auto-reload (Nodemon)** | Reinicia o servidor automaticamente quando há alterações em `server.js` ou outros arquivos monitorados. | Execute `npm run dev` para iniciar o servidor com o Nodemon ativo. |

| 🔄 **LiveReload** | Atualiza automaticamente o navegador sempre que há alterações em arquivos HTML, CSS ou JS dentro da pasta `public/`. | Os pacotes `livereload` e `connect-livereload` monitoram a pasta `public/` e recarregam o navegador. |

---

## ⚙️ Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Nodemon](https://nodemon.io/)
- [Livereload](https://www.npmjs.com/package/livereload)
- [Connect-livereload](https://www.npmjs.com/package/connect-livereload)

---

## 📁 Estrutura básica do projeto

meu-projeto/
│
├── public/
│ ├── index.html
│ ├── css/
│ ├── js/
│ ├── pages/
│ └── logos/
│
├── server.js
├── nodemon.json
├── package.json
└── README.md


---

## 💻 Como executar o projeto

1. Instale as dependências:
    ```bash
   npm install
´
2. Inicie o servidor com Nodemon para auto-reload:
   ```bash
  npm run dev

3. Abra o navegador e acesse:
   ```
   http://localhost:3000
   ```

