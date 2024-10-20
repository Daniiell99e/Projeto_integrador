const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const carousel = document.getElementById('carousel-list');
let scrollPosition = 0;
const itemWidth = 95; // Largura de cada item, incluindo margem
const visibleItems = 4; // Quantidade de itens visíveis na tela ao mesmo tempo


// Função para alternar a visibilidade do menu em dispositivos móveis
function toggleMenu(){
    // Obtém o elemento do menu móvel pelo ID "menu-mobile"
    const menuMobile =  document.getElementById("menu-mobile")

    // Verifica se o menu está atualmente ativo, ou seja, se a classe do elemento é "menu-mobile-active"
    if(menuMobile.className === "menu-mobile-active"){
         // Se estiver ativo, altera a classe para "menu-mobile", desativando-o (ocultando o menu)
        menuMobile.className = "menu-mobile"
    }else{
        // Se não estiver ativo, altera a classe para "menu-mobile-active", ativando-o (exibindo o menu)
        menuMobile.className = "menu-mobile-active"
    }
}

//trocar a cor do link quando clicar 
const list = document.querySelectorAll('.list');
function activeLink(){
    list.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
}
list.forEach((item) =>
    item.addEventListener('click', activeLink));


// Esse é o javascript do carrocel - inicio
nextBtn.addEventListener('click', () => {
    const maxScroll = (carousel.children.length - visibleItems) * itemWidth;

    // Verifica se a scrollPosition atingiu o máximo
    if (scrollPosition >= maxScroll) {
        // Se sim, vai para o início
        scrollPosition = 0;
    } else {
        // Caso contrário, aumenta a posição
        scrollPosition = Math.min(scrollPosition + itemWidth, maxScroll);
    }

    carousel.style.transform = `translateX(-${scrollPosition}px)`;
});

prevBtn.addEventListener('click', () => {
            scrollPosition = Math.max(scrollPosition - itemWidth, 0);
            carousel.style.transform = `translateX(-${scrollPosition}px)`;
        });

// Esse é o javascript do carousl - final
