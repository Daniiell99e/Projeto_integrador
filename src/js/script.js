const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const carousel = document.getElementById('carousel-list');
let scrollPosition = 0;
const itemWidth = 95; // Largura de cada item, incluindo margem
const visibleItems = 4; // Quantidade de itens visíveis na tela ao mesmo tempo


//trocar a cor do link quando clicar inicio
const list = document.querySelectorAll('.list');
function activeLink(){
    list.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
}
list.forEach((item) =>
    item.addEventListener('click', activeLink));
//trocar a cor do link quando clicar fim

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
//carrocel - final

//slide inicio
        let currentIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
                
        function showSlide(index) {
        // Remove qualquer classe zoom ou reset de todas as imagens
        slides.forEach(slide => slide.classList.remove('zoom', 'reset'));
                
        // Calcula o índice da imagem atual
        currentIndex = (index + totalSlides) % totalSlides;
                
        // Exibe a imagem atual (sem ainda aplicar o zoom)
        document.querySelector('.slides').style.transform = `translateX(${-currentIndex * 100}%)`;
                
        // Após exibir, aplica o zoom in na imagem atual
        setTimeout(() => {
        slides[currentIndex].classList.add('zoom');
        }, 1000); // Dá meio segundo para a transição de slide antes de aplicar o zoom
                
        // Depois de 2 segundos, remove o zoom (zoom out)
            setTimeout(() => {
                slides[currentIndex].classList.remove('zoom');
                slides[currentIndex].classList.add('reset');
                }, 2700); // 2 segundos para o efeito de zoom in, depois zoom out
            }
                
        // Função para iniciar o slider automaticamente
        function startSlider() {
            showSlide(currentIndex); // Exibe a primeira imagem
                
                setInterval(() => {
                    currentIndex++; // Incrementa para a próxima imagem
                    showSlide(currentIndex); // Exibe a próxima imagem e aplica o zoom
                }, 6000); // 5 segundos para cada ciclo (tempo para zoom in, zoom out e troca de imagem)
        }
                
        // Inicia o slider
        startSlider();
    // slide - final

// icone de clique para expandir menu lateral - inicio
    document.getElementById('open_btn').addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('open-sidebar');
    });
// icone de clique para expandir menu lateral - final