document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE AUTH (Padrão) ---
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/public/index.html';
        return;
    }
    // (Lógica do Header omitida para brevidade, mas mantenha se tiver o código do menu)

    // --- RECUPERAÇÃO DE DADOS ---
    const roteiroAtualJson = sessionStorage.getItem('novoRoteiro');
    
    if (!roteiroAtualJson) {
        alert("Nenhum destino selecionado. Voltando para a escolha.");
        window.location.href = '/public/pages/escolherdest.html';
        return;
    }

    const roteiroAtual = JSON.parse(roteiroAtualJson);
    
    // Recupera atrações disponíveis
    let atracoesDisponiveis = roteiroAtual.pontos_turisticos || [];
    if (atracoesDisponiveis.length === 0) {
        const atracoesSalvas = sessionStorage.getItem('pontosTuristicosDisponiveis');
        if (atracoesSalvas) atracoesDisponiveis = JSON.parse(atracoesSalvas);
    }

    const selectedAttractions = new Set();
    // --- PREENCHIMENTO DA TELA ---
    
    const cityData = roteiroAtual.cidade;
    const countryData = roteiroAtual.pais;

    document.getElementById('dest-city-name').textContent = `${cityData.nome}, ${countryData.nome}`;
    document.getElementById('dest-city-name-span').textContent = cityData.nome;
    
    const desc = cityData.descricao || "Explore este destino incrível.";
    document.getElementById('dest-description').textContent = desc.length > 200 ? desc.substring(0, 200) + '...' : desc;

    if (cityData.url_imagem) {
        document.getElementById('dest-hero-image').style.backgroundImage = `url('${cityData.url_imagem}')`;
    }

    const attractionsList = document.getElementById('attractions-list');
    attractionsList.innerHTML = '';

    const displayAttractions = atracoesDisponiveis.slice(0, 8); 

    displayAttractions.forEach((attraction, index) => {
        const card = document.createElement('article');
        card.className = 'tour-card city-card';
        
        const priceText = attraction.e_gratuito || attraction.valor === 0 ? 'Grátis' : `${attraction.moeda || '$'} ${attraction.valor || '?'}`;
        const imgUrl = attraction.url_imagem || 'https://via.placeholder.com/300x200?text=Sem+Foto';

        card.innerHTML = `
            <div class="tour-image">
                <img src="${imgUrl}" alt="${attraction.nome}">
            </div>
            <div class="tour-details">
                <h3 class="tour-name">${attraction.nome}</h3>
                <p class="tour-info">
                    <i class="fas fa-tag"></i> ${attraction.categoria || 'Geral'} &nbsp;|&nbsp; 
                    <i class="fas fa-money-bill-wave"></i> ${priceText}
                </p>
                <button class="btn card-button" id="btn-attr-${index}">Adicionar ao Roteiro</button> 
            </div>
        `;
        attractionsList.appendChild(card);

        const btn = card.querySelector(`#btn-attr-${index}`);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (selectedAttractions.has(attraction)) {
                selectedAttractions.delete(attraction);
                btn.textContent = "Adicionar ao Roteiro";
                btn.classList.remove('selected');
            } else {
                selectedAttractions.add(attraction);
                btn.innerHTML = '<i class="fas fa-check"></i> Adicionado';
                btn.classList.add('selected');
            }
        });
    });


    // --- LÓGICA DO FORMULÁRIO (CRIAR ROTEIRO E AVANÇAR) ---
    const form = document.getElementById('trip-config-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Captura dados do formulário
        const diasTotal = parseInt(document.getElementById('dias').value);
        const dataInicio = document.getElementById('data-inicio').value;
        const pessoas = parseInt(document.getElementById('pessoas').value);
        const orcamento = parseFloat(document.getElementById('orcamento').value) || 0;
        const horarioSelecionado = document.querySelector('input[name="horario_preferido"]:checked').value;

        // Atualiza metadados do roteiro
        roteiroAtual.roteiro.duracao_dias = diasTotal;
        roteiroAtual.roteiro.data_inicio = dataInicio;
        roteiroAtual.roteiro.numero_pessoas = pessoas;
        roteiroAtual.roteiro.orcamento_total = orcamento;
        roteiroAtual.roteiro.horario_preferencial = horarioSelecionado;

        // Cria a estrutura dos DIAS
        roteiroAtual.dias = [];

        for (let i = 1; i <= diasTotal; i++) {
            let pontosDoDia = [];

            if (i === 1 && selectedAttractions.size > 0) {
                pontosDoDia = Array.from(selectedAttractions);
            }

            roteiroAtual.dias.push({
                numero_dia: i,
                pontos_turisticos: pontosDoDia
            });
        }
        sessionStorage.setItem('novoRoteiro', JSON.stringify(roteiroAtual));
        console.log("Roteiro Criado com Sucesso:", roteiroAtual);
        window.location.href = '/public/pages/roteiro-diario.html';
    });

});