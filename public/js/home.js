document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token');
    const dataContainer = document.getElementById('api-data');
    const userName = localStorage.getItem('userName');
    const profileTrigger = document.getElementById('profile-menu-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (!token) {
        window.location.href = '/public/index.html';
        return;
    }

    if (userName) {
        const greetingElement = document.getElementById('user-greeting');
        if (greetingElement) {
            // Capitaliza a primeira letra (opcional, fica mais bonito)
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
            greetingElement.textContent = `Olá, ${formattedName}!`;
        }
    }

    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique feche o menu imediatamente
            profileDropdown.classList.toggle('show');
        });
    }

    // 2. Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (profileDropdown && profileDropdown.classList.contains('show')) {
            if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        }
    });

    async function fetchProtectedData() {
        try {
            const response = await fetch('http://localhost:3333/api/tourist/raw-curated-cities', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            const data = await response.json();

            if (response.ok) {
                dataContainer.textContent = JSON.stringify(data, null, 2);
            } else {
                localStorage.removeItem('token');
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                window.location.href = '/public/index.html';
            }

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            dataContainer.textContent = 'Erro ao conectar ao servidor.';
        }
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Limpa TUDO do localStorage (Token e Nome)
            localStorage.removeItem('token');
            localStorage.removeItem('userName'); // [NOVO] Remove o nome
            
            // Redireciona para o login
            window.location.href = '/public/index.html';
        });
    }

    fetchProtectedData();
});