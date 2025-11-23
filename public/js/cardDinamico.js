const destinos = [
    {        
        enderecoImg: "../imgsDestino/Rio.jpg", 
        nomeCidade: "Rio de Janeiro",
        nomePais: "Brasil"
    },
    {
        enderecoImg: "../imgsDestino/Paris.jpg",
        nomeCidade: "Paris",
        nomePais: "França"
    },
    {
        enderecoImg: "../imgsDestino/Tóquio.jpg",
        nomeCidade: "Tóquio",
        nomePais: "Japão"
    },
    {
        enderecoImg: "../imgsDestino/NovaIorque.jpg",
        nomeCidade: "Nova Iorque",
        nomePais: "EUA"
    },
    {
        enderecoImg: "../imgsDestino/Sidney.jpg",
        nomeCidade: "Sydney",
        nomePais: "Austrália"
    },
    {
        enderecoImg: "../imgsDestino/Roma.jpg",
        nomeCidade: "Roma",
        nomePais: "Itália"
    }
    
]

// Localiza o contêiner onde os cards serão injetados 
const containerCardsGrid = document.querySelector("#containerCards .city-cards-grid");

if (!containerCardsGrid) {
    console.error("Elemento '.city-cards-grid' dentro de '#containerCards' não encontrado.");
} else {
    // Cria o DocumentFragment para otimizar a inserção
    const fragmento = document.createDocumentFragment()

    // Itera sobre cada destino
    destinos.forEach(destino => {

        const destinoId = criarIdDestino(destino.nomeCidade, destino.nomePais); // Ex: 'paris_franca'
        
        // Estrutura: <article class="city-card">
        const cardDestino = document.createElement('article')
        cardDestino.className = 'city-card'

        // Estrutura: <div class="city-image-placeholder"> Mantemos a classe para CSS de layout
        const cardImagemPlaceholder = document.createElement('div')
        cardImagemPlaceholder.className = 'city-image-placeholder'

        // Conteúdo da Imagem: <img>
        const imagem = document.createElement('img')
        imagem.src = destino.enderecoImg
        imagem.alt = `Foto de ${destino.nomeCidade}`
        
        
        cardImagemPlaceholder.appendChild(imagem)


        // Estrutura: <div class="city-details">
        const cardInfo = document.createElement('div')
        cardInfo.className = 'city-details'

        // Conteúdo da Cidade/País: <h3 class="city-name">
        const nomeCidadePaisElemento = document.createElement('h3')
        nomeCidadePaisElemento.className = 'city-name'
        nomeCidadePaisElemento.textContent = `${destino.nomeCidade}, ${destino.nomePais}`

        // Conteúdo do Botão: <button class="btn btn-secondary card-button">
        const botaoDetalhes = document.createElement('button')
        botaoDetalhes.className = 'btn btn-secondary card-button'
        botaoDetalhes.id = `id_${destinoId}`
        botaoDetalhes.setAttribute('data-id', destinoId)
        botaoDetalhes.textContent = 'Ver detalhes'

        
        // Montagem do bloco de informações (city-details)
        cardInfo.appendChild(nomeCidadePaisElemento)
        cardInfo.appendChild(botaoDetalhes)

        
        // Montagem do Card Completo (article.city-card)
        cardDestino.appendChild(cardImagemPlaceholder)
        cardDestino.appendChild(cardInfo)

        
        // Adiciona o Card completo ao DocumentFragment
        fragmento.appendChild(cardDestino)
    });

    
    // Renderização Final: Insere o Fragmento no contêiner principal.
    containerCardsGrid.appendChild(fragmento)
}

// Função auxiliar para criar um ID amigável (slug)
function criarIdDestino(cidade, pais) {
    // Concatena, converte para minúsculas, remove acentos, e substitui espaços por underscore
    const idString = `${cidade}_${pais}`
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, '_'); // Substitui espaços por underscores
    return idString;
}