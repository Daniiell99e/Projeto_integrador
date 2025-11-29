document.addEventListener('DOMContentLoaded', () => {

    // --- 1. AUTH & HEADER ---
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/public/index.html'; 
        return;
    }
    const userName = localStorage.getItem('userName');
    if (userName) {
        const greetingElement = document.getElementById('user-greeting');
        if (greetingElement) {
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
            greetingElement.textContent = `Olá, ${formattedName}!`;
        }
    }

    // --- 2. MENU DROPDOWN ---
    const profileTrigger = document.getElementById('profile-menu-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }
    document.addEventListener('click', (e) => {
        if (profileDropdown && profileDropdown.classList.contains('show')) {
            if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        }
    });
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/public/index.html';
        });
    }

    // --- 3. CARREGAR ROTEIROS (NOVO) ---
    const routesContainer = document.getElementById('my-routes-container');
    const API_ROTEIROS = 'http://localhost:3333/roteiros';

    async function fetchMyRoutes() {
        try {
            const response = await fetch(API_ROTEIROS, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao buscar roteiros');

            const roteiros = await response.json();
            renderRoutes(roteiros);

        } catch (error) {
            console.error(error);
            routesContainer.innerHTML = '<p style="text-align: center; color: #d32f2f;">Erro ao carregar roteiros. Tente novamente.</p>';
        }
    }

    function renderRoutes(roteiros) {
        routesContainer.innerHTML = '';

        if (roteiros.length === 0) {
            routesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; width: 100%; grid-column: 1/-1;">
                    <p style="color: #666; margin-bottom: 15px;">Você ainda não tem roteiros criados.</p>
                    <a href="/public/pages/escolherdest.html" class="btn btn-primary">Criar meu primeiro roteiro</a>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        roteiros.forEach(roteiro => {
            const card = document.createElement('article');
            card.className = 'route-card';
            
            // Formatação de Dados
            const dataInicio = new Date(roteiro.data_inicio).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
            const imagemCidade = roteiro.cidade?.url_imagem || 'https://via.placeholder.com/400x200?text=Sem+Imagem';
            const nomeCidade = roteiro.cidade?.nome || 'Cidade Desconhecida';
            const nomePais = roteiro.cidade?.pais?.nome || '';
            // Tenta contar atividades (se o backend mandar esse dado, senão mostra "?")
            // Como o endpoint getAll atual não manda contagem, deixamos genérico ou removemos
            const atividadesTexto = "Ver detalhes"; 

            card.innerHTML = `
                <div class="route-image">
                    <img src="${imagemCidade}" alt="${nomeCidade}">
                    <div class="image-text">
                        <p>${nomeCidade}, ${nomePais}</p>
                    </div>
                </div>
                <div class="route-details">
                    <p class="route-info">
                        <i class="fas fa-calendar-alt"></i> Início: ${dataInicio} <br>
                        <i class="fas fa-clock"></i> ${roteiro.duracao_dias} dias
                    </p>
                    <a href="/public/pages/roteiro-diario.html?id=${roteiro.id}" class="btn btn-tertiary">Ver Roteiro</a>
                </div>
            `;
            fragment.appendChild(card);
        });

        routesContainer.appendChild(fragment);
    }

    // Inicia o carregamento
    fetchMyRoutes();
});