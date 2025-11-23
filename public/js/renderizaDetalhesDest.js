    //ARRAY DE OBJ PARA SIMULAR O JSON DA API
const DADOS_DESTINOS = {
    // A chave deve corresponder ao 'cidadeID' passado na URL (ex: ?cidadeID=rio_de_janeiro_brasil)

    "rio_de_janeiro_brasil": {
        nome: "Rio de Janeiro",
        pais: "Brasil",
        tituloHero: "Rio de Janeiro, Brasil",
        enderecoImg: "../imgsDestino/Rio.jpg",
        descricao: "Conhecida como a 'Cidade Maravilhosa', o Rio encanta com suas paisagens naturais, que incluem praias famosas, montanhas e a icônica estátua do Cristo Redentor.",
        pontosTuristicos: [
            { id: "cristo_redentor", nome: "Cristo Redentor", duracao: "3h", custo: "R$ 100" },
            { id: "pao_de_acucar", nome: "Pão de Açúcar", duracao: "4h", custo: "R$ 150" }
        ]
    },
    
    "paris_franca": {
        nome: "Paris",
        pais: "França",
        tituloHero: "Paris, França",
        enderecoImg: "../imgsDestino/Paris.jpg",
        descricao: "A Cidade Luz é conhecida por sua arte, arquitetura, culinária e museus mundialmente famosos. É um centro global de arte, moda e gastronomia, e é frequentemente chamada de a cidade mais romântica do mundo.",
        pontosTuristicos: [
            { id: "torre_eiffel", nome: "Torre Eiffel", duracao: "2-3h", custo: "€29" },
            { id: "museu_louvre", nome: "Museu do Louvre", duracao: "4-5h", custo: "€17" }
        ]
    },
    
    "toquio_japao": {
        nome: "Tóquio",
        pais: "Japão",
        tituloHero: "Tóquio, Japão",
        enderecoImg: "../imgsDestino/Tóquio.jpg",
        descricao: "Uma metrópole vibrante que combina arranha-céus futuristas, templos históricos e bairros de moda mundial. É um centro de tecnologia, cultura pop e tradição milenar.",
        pontosTuristicos: [
            { id: "shibuya_crossing", nome: "Cruzamento de Shibuya", duracao: "1h", custo: "Grátis" },
            { id: "senso_ji", nome: "Templo Senso-ji", duracao: "2h", custo: "Grátis" }
        ]
    },

    "nova_iorque_eua": {
        nome: "Nova Iorque",
        pais: "EUA",
        tituloHero: "Nova Iorque, EUA",
        enderecoImg: "../imgsDestino/NovaIorque.jpg",
        descricao: "A 'Cidade que Nunca Dorme' é um polo global de finanças, cultura, mídia e moda. É famosa pelos seus teatros da Broadway, arranha-céus icônicos e o Central Park.",
        pontosTuristicos: [
            { id: "times_square", nome: "Times Square", duracao: "2h", custo: "Grátis" },
            { id: "estatua_da_liberdade", nome: "Estátua da Liberdade", duracao: "4h", custo: "US$ 25" }
        ]
    },

    "sydney_australia": {
        nome: "Sydney",
        pais: "Austrália",
        tituloHero: "Sydney, Austrália",
        enderecoImg: "../imgsDestino/Sidney.jpg",
        descricao: "A maior cidade da Austrália, conhecida pela espetacular Opera House, Harbour Bridge e suas praias deslumbrantes como Bondi. Combina modernidade e vida ao ar livre.",
        pontosTuristicos: [
            { id: "opera_house", nome: "Sydney Opera House", duracao: "2h", custo: "A$ 45" },
            { id: "bondi_beach", nome: "Bondi Beach", duracao: "3h", custo: "Grátis" }
        ]
    },

    "roma_italia": {
        nome: "Roma",
        pais: "Itália",
        tituloHero: "Roma, Itália",
        enderecoImg: "../imgsDestino/Roma.jpg",
        descricao: "A Cidade Eterna é um tesouro de ruínas antigas, igrejas barrocas e a sede do Vaticano. Com quase 3.000 anos de história influente, é um marco para a arte, arquitetura e cultura mundial.",
        pontosTuristicos: [
            { id: "coliseu", nome: "Coliseu", duracao: "3h", custo: "€16" },
            { id: "vaticano", nome: "Vaticano (Basílica de S. Pedro)", duracao: "6h", custo: "Variável" }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 3.1. Obter o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const cidadeId = urlParams.get('cidadeID'); 

    // 3.2. Buscar os Dados
    const destino = DADOS_DESTINOS[cidadeId];

    if (destino) {
        
        // --- A. Atualização dos Elementos Principais ---
        
        // Título Hero (Ex: Paris, França)
        document.querySelector('.hero-title').textContent = destino.tituloHero;
        
        // Imagem Principal (Hero) - Usamos background-image no elemento
        const heroImageElement = document.querySelector('.destination-hero .hero-image');
        if (heroImageElement && destino.enderecoImg) {
            heroImageElement.style.backgroundImage = `url('${destino.enderecoImg}')`;
            heroImageElement.style.backgroundSize = 'cover';
            heroImageElement.style.backgroundPosition = 'center';
        }
        
        // Breadcrumb (Ex: Início / Detalhes do Destino)
        // Você pode querer que seja: Início / Paris
        document.querySelector('.breadcrumb strong').textContent = destino.nome;
        
        // Descrição
        const descriptionElement = document.querySelector('.destination-description');
        descriptionElement.textContent = destino.descricao + ' ';
        // Adiciona o link "ver mais" novamente após setar o texto
        const readMoreLink = document.createElement('a');
        readMoreLink.href = "#"; 
        readMoreLink.className = 'read-more-link';
        readMoreLink.textContent = 'ver mais';
        descriptionElement.appendChild(readMoreLink);
        
        // --- B. Renderização dos Pontos Turísticos ---
        const tourListContainer = document.querySelector('.tour-cards-list');
        tourListContainer.innerHTML = ''; // Limpa os placeholders

        destino.pontosTuristicos.forEach(tour => {
            const tourCardHTML = `
                <article class="tour-card city-card" data-tour-id="${tour.id}">
                    <div class="city-image-placeholder tour-image">
                        <p class="image-text">Foto de ${tour.nome}</p>
                    </div>
                    <div class="tour-details">
                        <h3 class="tour-name city-name">${tour.nome}</h3>
                        <p class="tour-info">⏰ ${tour.duracao} &nbsp; | &nbsp; ${tour.custo}</p>
                        <button class="btn card-button add-to-route-btn" data-tour-id="${tour.id}">Adicionar ao Roteiro</button>
                    </div>
                </article>
            `;
            tourListContainer.insertAdjacentHTML('beforeend', tourCardHTML);
        });

        // 3.3. Inicializa a lógica de seleção de tours após renderizar
        initializeTourSelection();

    } else {
        // Tratar o caso de um ID inválido ou ausente
        document.querySelector('.hero-title').textContent = 'Destino não encontrado';
        document.querySelector('.destination-description').textContent = 'O ID de destino na URL é inválido. Por favor, volte para a página de seleção e escolha um destino válido.';
        // Ocultar a seção de configuração e pontos turísticos
        document.querySelector('.config-section').style.display = 'none';
        document.querySelector('.popular-cities-section').style.display = 'none';
    }
});