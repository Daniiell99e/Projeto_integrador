document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO E AUTH ---
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/public/index.html'; return; }

    const API_BASE = 'http://localhost:3333';
    const urlParams = new URLSearchParams(window.location.search);
    const roteiroId = urlParams.get('id');

    let roteiroAtual = null;
    let diaSelecionado = 1;
    let hasUnsavedChanges = false;
    let sugestoesCache = [];

    const saveBtn = document.getElementById('save-itinerary-btn');
    const deleteBtn = document.getElementById('delete-itinerary-btn');
    const actionsCard = document.querySelector('.actions-card');


    // --- FUNÇÃO AUXILIAR PARA REMOVER DUPLICATAS ---
    function removeDuplicates(list) {
        const seen = new Set();
        return list.filter(item => {
            const name = item.nome ? item.nome.trim().toLowerCase() : '';
            
            if (!name) return false; // Ignora itens sem nome

            if (seen.has(name)) {
                return false;
            }
            seen.add(name);
            return true;
        });
    }


    // --- INICIALIZAÇÃO ---
    async function init() {
        if (roteiroId) {
            await loadFromAPI(roteiroId);
        } else {
            loadFromSession();
        }

        if (roteiroAtual) {
            renderPage();
            if (roteiroAtual.isEditMode) {
                activateMinimalMode();
            }
        }
    }

    function activateMinimalMode() {
        if (actionsCard) actionsCard.classList.add('minimal');
        if(saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> <span>Salvar</span>';
            saveBtn.title = "Salvar Alterações";
        }
        if (deleteBtn) {
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> <span>Excluir</span>';
            deleteBtn.title = "Excluir Roteiro";
        }
    }

    function markUnsaved() {
        if (!hasUnsavedChanges && saveBtn) {
            hasUnsavedChanges = true;
            saveBtn.classList.add('unsaved');
            saveBtn.title = "Você tem alterações não salvas!";
        }
    }

    function loadFromSession() {
        const json = sessionStorage.getItem('novoRoteiro');
        if (!json) {
            alert("Nenhum roteiro em construção. Voltando.");
            window.location.href = '/public/pages/escolherdest.html';
            return;
        }
        const rawData = JSON.parse(json);
        roteiroAtual = {
            isEditMode: false,
            titulo: `Roteiro: ${rawData.cidade.nome}`,
            data_inicio: rawData.roteiro.data_inicio,
            duracao_dias: parseInt(rawData.roteiro.duracao_dias),
            pessoas: parseInt(rawData.roteiro.numero_pessoas),
            orcamento_total: parseFloat(rawData.roteiro.orcamento_total),
            cidade_id: rawData.cidade.id,
            dias: {} 
        };
        for(let i=1; i<=roteiroAtual.duracao_dias; i++) roteiroAtual.dias[i] = [];
        if (rawData.dias && rawData.dias[0] && rawData.dias[0].pontos_turisticos) {
            roteiroAtual.dias[1] = rawData.dias[0].pontos_turisticos.map(p => normalizeAttraction(p));
        }
    }

    async function loadFromAPI(id) {
        try {
            const response = await fetch(`${API_BASE}/roteiros/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erro ao buscar roteiro');
            const data = await response.json();

            roteiroAtual = {
                isEditMode: true,
                id: data.roteiro.id,
                titulo: data.roteiro.titulo,
                data_inicio: data.roteiro.data_inicio,
                duracao_dias: data.roteiro.duracao_dias,
                pessoas: data.roteiro.numero_pessoas,
                orcamento_total: data.roteiro.orcamento_total,
                dias: data.dias 
            };

            for(let dia in roteiroAtual.dias) {
                roteiroAtual.dias[dia] = roteiroAtual.dias[dia].map(item => ({
                    id: item.id,
                    nome: item.atracao.nome,
                    descricao: item.atracao.descricao,
                    categoria: item.atracao.categoria || 'Geral',
                    imagem: item.atracao.url_imagem,
                    price: item.atracao.preco_estimado || 0,
                    duration: '2h', 
                    time: item.horario || '09:00'
                }));
            }
            
            if(deleteBtn) deleteBtn.style.display = 'inline-flex';

        } catch (error) {
            console.error(error);
            alert("Erro ao carregar roteiro.");
            window.location.href = '/public/pages/home.html';
        }
    }

    function normalizeAttraction(p) {
        return {
            nome: p.nome,
            descricao: p.descricao,
            categoria: p.categoria || 'Geral',
            imagem: p.url_imagem || p.imagem,
            price: p.valor || p.price || 0,
            duration: '2h',
            time: '09:00'
        };
    }

    // --- RENDERIZAÇÃO ---
    function renderPage() {
        renderHeader();
        renderDayTabs();
        renderActivities();
        updateSummaries();
    }

    function renderHeader() {
        document.querySelector('.page-title').textContent = roteiroAtual.titulo;
        const start = new Date(roteiroAtual.data_inicio);
        start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
        const end = new Date(start);
        end.setDate(start.getDate() + roteiroAtual.duracao_dias);
        const fmt = (d) => d.toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'});
        document.querySelector('.page-subtitle').textContent = `${roteiroAtual.duracao_dias} dias • ${fmt(start)} - ${fmt(end)} • ${roteiroAtual.pessoas} pessoas`;
    }

    function renderDayTabs() {
        const container = document.getElementById('dayTabs');
        container.innerHTML = '';

        // 1. Renderiza os dias existentes
        for (let i = 1; i <= roteiroAtual.duracao_dias; i++) {
            const btn = document.createElement('button');
            btn.className = `day-tab ${i === diaSelecionado ? 'active' : ''}`;
            btn.textContent = `Dia ${i}`;
            btn.onclick = () => {
                diaSelecionado = i;
                renderDayTabs();
                renderActivities();
                updateSummaries();
            };
            container.appendChild(btn);
        }

        const addBtn = document.createElement('button');
        addBtn.className = 'day-tab add-day-btn';
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addBtn.title = "Adicionar um dia ao roteiro";
        
        addBtn.onclick = () => {
            // Lógica para adicionar dia
            roteiroAtual.duracao_dias++;
            const novoDia = roteiroAtual.duracao_dias;
            
            // Inicializa o array vazio para o novo dia
            roteiroAtual.dias[novoDia] = [];
            
            // Seleciona o novo dia automaticamente
            diaSelecionado = novoDia;
            
            // Marca como alterado e re-renderiza
            markUnsaved();
            renderHeader();
            renderDayTabs();
            renderActivities();
            updateSummaries();
            
            // Scroll suave para o fim das abas
            setTimeout(() => container.scrollLeft = container.scrollWidth, 100);
        };

        container.appendChild(addBtn);
    }

    function renderActivities() {
        const container = document.getElementById('activitiesList');
        const atividadesDoDia = roteiroAtual.dias[diaSelecionado] || [];
        const currentData = new Date(roteiroAtual.data_inicio);
        currentData.setDate(currentData.getDate() + (diaSelecionado - 1));
        const dataStr = currentData.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        
        const titleEl = document.querySelector('.section-title');
        if(titleEl) titleEl.textContent = dataStr.charAt(0).toUpperCase() + dataStr.slice(1);

        if (atividadesDoDia.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 3rem; color: #9CA3AF; background: white; border-radius: 12px; border: 1px solid #E5E7EB;"><p>Nenhuma atividade neste dia.</p><p style="font-size: 0.875rem; margin-top: 0.5rem;">Clique em "Adicionar Atividade" para começar.</p></div>`;
            return;
        }

        container.innerHTML = atividadesDoDia.map((act, index) => `
            <div class="activity-card">
                <div class="activity-header">
                    <div class="activity-time-info">
                        <div class="activity-time">${act.time}</div>
                        <div class="activity-duration">${act.duration}</div>
                    </div>
                    <div class="activity-actions">
                        <button class="action-btn delete-btn" onclick="window.removeActivity(${index})" title="Remover">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="activity-body">
                    <h4 class="activity-title">${act.nome}</h4>
                    <p class="activity-description">${act.descricao ? act.descricao.substring(0, 60) + '...' : ''}</p>
                </div>
                <div class="activity-footer">
                    <span class="activity-category">${act.categoria}</span>
                    <span class="activity-price">€${act.price || 0}</span>
                </div>
            </div>
        `).join('');
    }

    function updateSummaries() {
        const atividadesDoDia = roteiroAtual.dias[diaSelecionado] || [];
        let custoDia = 0;
        let minutosDia = 0;
        atividadesDoDia.forEach(a => {
            custoDia += parseFloat(a.price || 0);
            const dur = a.duration || "0";
            if(dur.includes('h')) minutosDia += parseInt(dur) * 60;
            if(dur.includes('m')) minutosDia += parseInt(dur);
        });
        const custoDiaTotal = custoDia * roteiroAtual.pessoas;

        const elActivities = document.getElementById('dailyActivities');
        const elDuration = document.getElementById('dailyDuration');
        const elCost = document.getElementById('dailyCost');

        if (elActivities) elActivities.textContent = atividadesDoDia.length === 1 ? '1 atividade' : `${atividadesDoDia.length} atividades`;
        if (elDuration) {
            const horas = Math.floor(minutosDia / 60);
            const mins = minutosDia % 60;
            elDuration.textContent = mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
        }
        if (elCost) elCost.textContent = `€${custoDiaTotal.toFixed(2)} (€${custoDia.toFixed(2)}/pessoa)`;
    }


    // --- MODAL E BUSCA ---
    const modal = document.getElementById('activityModal');
    const addBtn = document.getElementById('addActivityBtn');
    const closeBtn = document.getElementById('closeModal');
    const searchInput = document.getElementById('attractionSearchInput');
    const resultsContainer = document.getElementById('attractionSearchResults');

    if(addBtn) {
        addBtn.addEventListener('click', async () => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            searchInput.value = ''; 
            searchInput.focus();

            if (sugestoesCache.length > 0) {
                renderSuggestions(sugestoesCache);
            } else {
                await fetchSuggestions();
            }
        });
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    async function fetchSuggestions() {
        resultsContainer.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Carregando sugestões...</p>';
        try {
            let url;
            if (roteiroAtual.isEditMode) {
                url = `${API_BASE}/roteiros/${roteiroAtual.id}/sugestoes-atracoes`;
            } else {
                const cidadeNome = roteiroAtual.titulo.replace('Roteiro: ', '').split(',')[0].trim();
                url = `${API_BASE}/api/tourist/search?q=${encodeURIComponent(cidadeNome)}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(!response.ok) throw new Error("Erro ao buscar");

            const data = await response.json();
            let rawList = Array.isArray(data) ? data : (data.pontos_turisticos || []);
            
            sugestoesCache = removeDuplicates(rawList);
            
            renderSuggestions(sugestoesCache);

        } catch (e) {
            console.error(e);
            resultsContainer.innerHTML = '<p style="text-align:center; color:red; grid-column:1/-1;">Erro ao carregar sugestões.</p>';
        }
    }

    function renderSuggestions(list) {
        resultsContainer.innerHTML = '';
        if(list.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Nenhuma sugestão encontrada.</p>';
            return;
        }
        const fragment = document.createDocumentFragment();
        list.forEach(att => {
            const div = document.createElement('div');
            div.className = 'attraction-card-mini';
            const img = att.url_imagem || att.imagem || 'https://via.placeholder.com/150';
            const price = att.e_gratuito ? 'Grátis' : (att.moeda || '$') + ' ' + (att.valor || att.preco || '?');
            div.innerHTML = `
                <img src="${img}" class="attraction-mini-img">
                <div class="attraction-mini-content">
                    <div class="attraction-mini-title" title="${att.nome}">${att.nome}</div>
                    <div class="attraction-mini-info">
                        <span>${att.categoria || 'Geral'}</span>
                        <span style="font-weight:bold; color:var(--primary);">${price}</span>
                    </div>
                </div>
            `;
            div.addEventListener('click', () => addActivityToDay(att));
            fragment.appendChild(div);
        });
        resultsContainer.appendChild(fragment);
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = sugestoesCache.filter(item => 
            item.nome.toLowerCase().includes(term) || 
            (item.categoria && item.categoria.toLowerCase().includes(term))
        );
        renderSuggestions(filtered);
    });

    function addActivityToDay(attraction) {
        const novaAtividade = normalizeAttraction(attraction);
        if(!roteiroAtual.dias[diaSelecionado]) roteiroAtual.dias[diaSelecionado] = [];
        roteiroAtual.dias[diaSelecionado].push(novaAtividade);
        markUnsaved();
        renderActivities();
        updateSummaries();
        closeModal();
    }

    window.removeActivity = (index) => {
        if(confirm("Remover esta atividade?")) {
            roteiroAtual.dias[diaSelecionado].splice(index, 1);
            markUnsaved();
            renderActivities();
            updateSummaries();
        }
    };

    if(saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.disabled = true;
            const originalContent = saveBtn.innerHTML; 
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            try {
                let url = `${API_BASE}/roteiros`;
                let method = 'POST';
                let payload = {};

                if (roteiroAtual.isEditMode) {
                    url = `${API_BASE}/roteiros/${roteiroAtual.id}`;
                    method = 'PUT';
                    payload = {
                        titulo: roteiroAtual.titulo,
                        orcamento_total: roteiroAtual.orcamento_total,
                        duracao_dias: roteiroAtual.duracao_dias
                    };
                } else {
                    const sessionData = JSON.parse(sessionStorage.getItem('novoRoteiro'));
                    sessionData.roteiro.duracao_dias = roteiroAtual.duracao_dias;

                    const diasArray = [];
                    for(let i=1; i<=roteiroAtual.duracao_dias; i++) {
                        diasArray.push({
                            numero_dia: i,
                            pontos_turisticos: roteiroAtual.dias[i].map(a => ({
                                nome: a.nome, descricao: a.descricao, categoria: a.categoria, url_imagem: a.imagem, valor: a.price, latitude: 0, longitude: 0, endereco: "Manual"
                            }))
                        });
                    }
                    payload = { ...sessionData, dias: diasArray };
                }

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Roteiro salvo com sucesso!");
                    hasUnsavedChanges = false;
                    saveBtn.classList.remove('unsaved');
                    if (!roteiroAtual.isEditMode) {
                        sessionStorage.removeItem('novoRoteiro');
                        window.location.href = '/public/pages/home.html';
                    } else {
                        window.location.reload();
                    }
                } else {
                    const err = await response.json();
                    throw new Error(err.message || "Erro ao salvar");
                }

            } catch (error) {
                alert("Erro: " + error.message);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalContent;
            }
        });
    }

    if(deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if(!confirm("Tem certeza?")) return;
            try {
                await fetch(`${API_BASE}/roteiros/${roteiroAtual.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                window.location.href = '/public/pages/home.html';
            } catch (e) { alert("Erro ao excluir."); }
        });
    }

    init();
});