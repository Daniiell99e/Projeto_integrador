document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE AUTH E HEADER ---
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

    // --- ELEMENTOS DA TELA ---
    const containerCards = document.querySelector('.city-cards-grid');
    const searchInput = document.querySelector('.city-search-input');
    const sectionTitle = document.querySelector('.popular-cities-section h2');
    
    let searchTimeout;

    // --- FUNÇÃO PARA CARREGAR CIDADES POPULARES (Curadas) ---
    async function loadCuratedCities() {
        try {
            containerCards.innerHTML = '<p class="loading-text">Carregando destinos incríveis...</p>';
            
            const response = await fetch('http://localhost:3333/api/tourist/curated-cities', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao buscar cidades curadas');

            const cities = await response.json();
            renderCards(cities, false); // false = modo lista (array de cidades)

        } catch (error) {
            console.error(error);
            containerCards.innerHTML = '<p class="error-text">Não foi possível carregar as sugestões. Tente buscar uma cidade.</p>';
        }
    }


    // --- FUNÇÃO DE BUSCA ---
    async function searchCity(query) {
        if (!query) {
            sectionTitle.textContent = "Cidades Populares";
            loadCuratedCities();
            return;
        }

        try {
            sectionTitle.textContent = `Resultados para "${query}"`;
            containerCards.innerHTML = '<p class="loading-text">Buscando seu destino...</p>';

            // Chama a rota de busca
            const response = await fetch(`http://localhost:3333/api/tourist/search?q=${encodeURIComponent(query)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if(response.status === 404) {
                    containerCards.innerHTML = '<p class="error-text">Cidade não encontrada. Tente outro nome (ex: "Paris", "Tokyo").</p>';
                    return;
                }
                throw new Error('Erro na busca');
            }
            const searchResult = await response.json();
            renderCards([searchResult], true); // true = modo busca (objeto complexo)

        } catch (error) {
            console.error(error);
            containerCards.innerHTML = '<p class="error-text">Erro ao buscar. Verifique sua conexão.</p>';
        }
    }


    // --- RENDERIZAÇÃO DOS CARDS ---
    function renderCards(dataList, isSearchResult) {
        containerCards.innerHTML = '';

        const fragment = document.createDocumentFragment();

        dataList.forEach(item => {
            let cityName, countryName, imageUrl, description, fullObject;

            if (isSearchResult) {
                cityName = item.cidade.nome;
                countryName = item.pais.nome;
                imageUrl = item.cidade.url_imagem;
                description = item.cidade.descricao;
                fullObject = item;
            } else {
                cityName = item.cidade.nome;
                countryName = item.pais.nome;
                imageUrl = item.cidade.url_imagem;
                description = item.cidade.descricao;
                fullObject = item;
            }

            const card = document.createElement('div');
            card.className = 'city-card';
            
            const objectString = encodeURIComponent(JSON.stringify(fullObject));

            card.innerHTML = `
                <div class="card-image">
                    <img src="${imageUrl || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}" alt="${cityName}">
                    <div class="card-overlay">
                        <span class="country-tag">${countryName}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${cityName}</h3>
                    <p>${description ? description.substring(0, 100) + '...' : 'Uma cidade incrível para descobrir.'}</p>
                    <button class="btn-select-dest" data-city-object="${objectString}">
                        Selecionar este Destino <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            fragment.appendChild(card);
        });

        containerCards.appendChild(fragment);

        document.querySelectorAll('.btn-select-dest').forEach(btn => {
            btn.addEventListener('click', function() {
                const data = JSON.parse(decodeURIComponent(this.dataset.cityObject));
                selectDestination(data);
            });
        });
    }

    // --- SELEÇÃO DO DESTINO ---
    function selectDestination(cityData) {
        
        // ... (código anterior que cria o novoRoteiro e salva no sessionStorage) ...
        
        const novoRoteiro = {
            roteiro: {
                data_inicio: null,
                duracao_dias: null,
                numero_pessoas: null,
                orcamento_total: null,
                horario_preferencial: null
            },
            pais: cityData.pais,
            cidade: cityData.cidade,
            dias: []
        };

        sessionStorage.setItem('novoRoteiro', JSON.stringify(novoRoteiro));
        sessionStorage.setItem('pontosTuristicosDisponiveis', JSON.stringify(cityData.pontos_turisticos));

        console.log("Destino salvo:", cityData.cidade.nome);

        window.location.href = '/public/pages/detalhesDestino.html'; 
    }


    // --- EVENTOS ---
    
    // Carregamento inicial
    loadCuratedCities();

    // Busca com Debounce (espera o usuário parar de digitar)
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        searchTimeout = setTimeout(() => {
            searchCity(query);
        }, 800); // Espera 800ms antes de buscar
    });

});