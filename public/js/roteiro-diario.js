document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE AUTH ---
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/public/index.html'; return; }

    // --- 2. DETECTAR MODO (CRIAR vs EDITAR) ---
    const urlParams = new URLSearchParams(window.location.search);
    const roteiroId = urlParams.get('id'); // Tenta pegar o ID da URL (?id=1)

    // Elementos
    const titleEl = document.getElementById('itinerary-title');
    const datesEl = document.getElementById('itinerary-dates');
    const daysContainer = document.getElementById('days-list');
    const saveBtn = document.getElementById('save-itinerary-btn');
    const deleteBtn = document.getElementById('delete-itinerary-btn');

    // Objeto global para manipular os dados
    let roteiroAtual = null;

    // --- FUNÇÃO DE INICIALIZAÇÃO ---
    async function init() {
        if (roteiroId) {
            // MODO EDIÇÃO: Busca do Banco
            await loadFromAPI(roteiroId);
        } else {
            // MODO CRIAÇÃO: Busca do SessionStorage
            loadFromSession();
        }
    }

    // --- A. CARREGAR DO SESSION STORAGE (Criação) ---
    function loadFromSession() {
        const roteiroJson = sessionStorage.getItem('novoRoteiro');
        if (!roteiroJson) {
            alert("Nenhum roteiro encontrado.");
            window.location.href = '/public/pages/escolherdest.html';
            return;
        }
        roteiroAtual = JSON.parse(roteiroJson);
        
        // Ajuste de estrutura para renderização
        // O Wizard cria: { roteiro: {...}, cidade: {...}, dias: [] }
        renderPage(roteiroAtual);
    }

    // --- B. CARREGAR DA API (Edição) ---
    async function loadFromAPI(id) {
        try {
            const response = await fetch(`http://localhost:3333/roteiros/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao buscar roteiro');

            const data = await response.json(); // Retorna { roteiro: {...}, dias: {...} }
            
            // NORMALIZAÇÃO DE DADOS
            // Precisamos converter o formato do banco para o formato que nossa tela entende
            
            // 1. Converte o objeto de dias { "1": [], "2": [] } em Array
            const diasArray = [];
            const totalDias = data.roteiro.duracao_dias;

            for(let i=1; i <= totalDias; i++) {
                const atividadesDoDia = data.dias[i] || [];
                
                // Normaliza as atividades para o formato visual
                const pontosTuristicos = atividadesDoDia.map(item => ({
                    nome: item.atracao.nome,
                    categoria: item.atracao.tipo,
                    moeda: 'R$', // Placeholder ou vindo do banco
                    valor: item.atracao.preco_estimado,
                    url_imagem: item.atracao.url_imagem
                }));

                diasArray.push({
                    numero_dia: i,
                    pontos_turisticos: pontosTuristicos
                });
            }

            // 2. Monta o objeto roteiroAtual unificado
            roteiroAtual = {
                isEditMode: true, // Flag para saber que estamos editando
                id: data.roteiro.id,
                cidade: data.roteiro.cidade,
                pais: data.roteiro.cidade.pais, // O include traz o país dentro da cidade
                roteiro: {
                    data_inicio: data.roteiro.data_inicio,
                    duracao_dias: data.roteiro.duracao_dias,
                    // ... outros campos
                },
                dias: diasArray
            };

            // 3. Mostra o botão de excluir
            if(deleteBtn) {
                deleteBtn.style.display = 'inline-flex';
            }
            
            // 4. Atualiza texto do botão salvar
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';

            renderPage(roteiroAtual);

        } catch (error) {
            console.error(error);
            alert("Erro ao carregar o roteiro.");
            window.location.href = '/public/pages/home.html';
        }
    }

    // --- RENDERIZAÇÃO (Comum para os dois modos) ---
    function renderPage(dados) {
        // Cabeçalho
        titleEl.textContent = `Roteiro em ${dados.cidade.nome}`;
        
        const startDate = new Date(dados.roteiro.data_inicio);
        startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        
        datesEl.innerHTML = `<i class="far fa-calendar-alt"></i> Início: ${startDate.toLocaleDateString('pt-BR', options)} • ${dados.roteiro.duracao_dias} dias`;

        // Lista de Dias
        daysContainer.innerHTML = '';

        dados.dias.forEach((dia) => {
            const currentDayDate = new Date(startDate);
            currentDayDate.setDate(startDate.getDate() + (dia.numero_dia - 1));
            const dateString = currentDayDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';

            let activitiesHtml = '';
            
            if (dia.pontos_turisticos && dia.pontos_turisticos.length > 0) {
                dia.pontos_turisticos.forEach(atividade => {
                    const imgUrl = atividade.url_imagem || 'https://via.placeholder.com/60?text=Foto';
                    // Tratamento de preço
                    const preco = atividade.valor ? `${atividade.moeda || ''} ${atividade.valor}` : 'Grátis';

                    activitiesHtml += `
                        <div class="activity-item">
                            <img src="${imgUrl}" alt="${atividade.nome}">
                            <div class="activity-info">
                                <h4>${atividade.nome}</h4>
                                <p>${atividade.categoria || 'Atração'} • ${preco}</p>
                            </div>
                            <div class="activity-actions" title="Remover (Visual)">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    `;
                });
            } else {
                activitiesHtml = '<div class="empty-day-msg">Nenhuma atividade planejada para este dia.</div>';
            }

            dayCard.innerHTML = `
                <div class="day-header">
                    <h3>Dia ${dia.numero_dia} <span style="font-weight:normal; font-size:0.9em; color:#666; margin-left:10px;">(${dateString})</span></h3>
                    <button class="btn-icon add-activity-btn" title="Adicionar Atividade"><i class="fas fa-plus"></i></button>
                </div>
                <div class="day-activities">
                    ${activitiesHtml}
                </div>
            `;
            daysContainer.appendChild(dayCard);
        });
    }

    // --- AÇÕES DOS BOTÕES ---

    // 1. Salvar (Create ou Update)
    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

        try {
            let url = 'http://localhost:3333/roteiros';
            let method = 'POST';

            // Se estivermos editando, muda para PUT e adiciona ID
            if (roteiroAtual.isEditMode) {
                url = `http://localhost:3333/roteiros/${roteiroAtual.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Envia o objeto inteiro (o backend decide o que usar)
                body: JSON.stringify(roteiroAtual) 
            });

            if (response.ok) {
                alert(roteiroAtual.isEditMode ? "Roteiro atualizado!" : "Roteiro criado com sucesso!");
                if (!roteiroAtual.isEditMode) sessionStorage.removeItem('novoRoteiro'); 
                window.location.href = '/public/pages/home.html';
            } else {
                const err = await response.json();
                throw new Error(err.message || 'Erro ao salvar');
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar: " + error.message);
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
        }
    });

    // 2. Deletar
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!confirm("Tem certeza que deseja excluir este roteiro?")) return;

            try {
                const response = await fetch(`http://localhost:3333/roteiros/${roteiroAtual.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    alert("Roteiro excluído.");
                    window.location.href = '/public/pages/home.html';
                } else {
                    throw new Error('Falha ao excluir');
                }
            } catch (error) {
                alert("Erro ao excluir roteiro.");
            }
        });
    }

    // Inicializa a página
    init();
});