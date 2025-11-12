const destinos = [
    {        
        enderecoImg: "imgsDestinos/RioDeJaneiro.jpg", 
        nomeCidade: "Rio de Janeiro",
        nomePais: "Brasil"
    },
    {
        enderecoImg: "imgsDestinos/Paris.jpg",
        nomeCidade: "Paris",
        nomePais: "França"
    },
    {
        enderecoImg: "imgsDestinos/Toquio.jpg",
        nomeCidade: "Tóquio",
        nomePais: "Japão"
    },
    {
        enderecoImg: "imgsDestinos/NewYork.jpg",
        nomeCidade: "Nova Iorque",
        nomePais: "EUA"
    },
    {
        enderecoImg: "imgsDestinos/Sidney.jpg",
        nomeCidade: "Sydney",
        nomePais: "Austrália"
    },
    {
        enderecoImg: "imgsDestinos/Roma.jpg",
        nomeCidade: "Roma",
        nomePais: "Itália"
    },
    {        
        enderecoImg: "imgsDestinos/RioDeJaneiro.jpg", 
        nomeCidade: "Rio de Janeiro",
        nomePais: "Brasil"
    },
    {
        enderecoImg: "imgsDestinos/Paris.jpg",
        nomeCidade: "Paris",
        nomePais: "França"
    },
    {
        enderecoImg: "imgsDestinos/Toquio.jpg",
        nomeCidade: "Tóquio",
        nomePais: "Japão"
    },
    {
        enderecoImg: "imgsDestinos/NewYork.jpg",
        nomeCidade: "Nova Iorque",
        nomePais: "EUA"
    },
    {
        enderecoImg: "imgsDestinos/Sidney.jpg",
        nomeCidade: "Sydney",
        nomePais: "Austrália"
    },
    {
        enderecoImg: "imgsDestinos/Roma.jpg",
        nomeCidade: "Roma",
        nomePais: "Itália"
    },
    {        
        enderecoImg: "imgsDestinos/RioDeJaneiro.jpg", 
        nomeCidade: "Rio de Janeiro",
        nomePais: "Brasil"
    },
    {
        enderecoImg: "imgsDestinos/Paris.jpg",
        nomeCidade: "Paris",
        nomePais: "França"
    },
    {
        enderecoImg: "imgsDestinos/Toquio.jpg",
        nomeCidade: "Tóquio",
        nomePais: "Japão"
    },
    {
        enderecoImg: "imgsDestinos/NewYork.jpg",
        nomeCidade: "Nova Iorque",
        nomePais: "EUA"
    },
    {
        enderecoImg: "imgsDestinos/Sidney.jpg",
        nomeCidade: "Sydney",
        nomePais: "Austrália"
    },
    {
        enderecoImg: "imgsDestinos/Roma.jpg",
        nomeCidade: "Roma",
        nomePais: "Itália"
    },
    {        
        enderecoImg: "imgsDestinos/RioDeJaneiro.jpg", 
        nomeCidade: "Rio de Janeiro",
        nomePais: "Brasil"
    },
    {
        enderecoImg: "imgsDestinos/Paris.jpg",
        nomeCidade: "Paris",
        nomePais: "França"
    },
    {
        enderecoImg: "imgsDestinos/Toquio.jpg",
        nomeCidade: "Tóquio",
        nomePais: "Japão"
    },
    {
        enderecoImg: "imgsDestinos/NewYork.jpg",
        nomeCidade: "Nova Iorque",
        nomePais: "EUA"
    },
    {
        enderecoImg: "imgsDestinos/Sidney.jpg",
        nomeCidade: "Sydney",
        nomePais: "Austrália"
    },
    {
        enderecoImg: "imgsDestinos/Roma.jpg",
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