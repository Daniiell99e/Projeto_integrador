document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os elementos do formulário
    const loginButton = document.getElementById('login-button');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const errorMessage = document.getElementById('error-message');

    // URL da sua API de autenticação
    const API_URL = 'http://localhost:3333/auth';

    const handleLogin = async () => {
        // 1. Limpa erros antigos e desabilita o botão
        errorMessage.classList.remove('active');
        errorMessage.textContent = '';
        loginButton.disabled = true;
        loginButton.textContent = 'Entrando...';

        // 2. Pega os valores dos inputs
        // const email = emailInput.value;
        // const senha = senhaInput.value;

        // 3. Validação simples no front-end
        if (!email || !senha) {
            showError('Por favor, preencha o e-mail e a senha.');
            return;
        }

        try {
            // 4. Envia a requisição para o back-end
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: senha 
                })
            });

            // 5. Analisa a resposta
            const data = await response.json();

            if (response.ok) {
                // Sucesso!
                
                // Salvamos o token no localStorage
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                if (data.user && data.user.user_name) {
                    localStorage.setItem('userName', data.user.user_name);
                }

                // [MUDANÇA AQUI]
                // Redireciona o usuário para a nova tela home.html
                window.location.href = '/public/pages/home.html'; 
            
            } else {
                // Falha no login
                showError(data.error || data.message || 'E-mail ou senha incorretos.');
            }

        } catch (error) {
            // Falha de rede
            console.error('Erro de conexão:', error);
            showError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    };

    // Função para exibir erros e reabilitar o botão
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
        loginButton.disabled = false;
        loginButton.textContent = 'Entrar';
    };

    // Adiciona o 'listener' ao botão de login
    loginButton.addEventListener('click', handleLogin);
    
    // Permite o login ao pressionar 'Enter' no campo de senha
    senhaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

});