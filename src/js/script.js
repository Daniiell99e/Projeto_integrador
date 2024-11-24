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
      


        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel-container');
            const slides = document.querySelectorAll('.slidecarro');
            const dotsContainer = document.querySelector('.dots-container');
            
            let currentIndex = 0;
            let startX = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            let isDragging = false;
            let animationID = 0;
            
            // Touch events
            carousel.addEventListener('touchstart', touchStart);
            carousel.addEventListener('touchmove', touchMove);
            carousel.addEventListener('touchend', touchEnd);
        
            // Mouse events (para teste no desktop)
            carousel.addEventListener('mousedown', touchStart);
            carousel.addEventListener('mousemove', touchMove);
            carousel.addEventListener('mouseup', touchEnd);
            carousel.addEventListener('mouseleave', touchEnd);
        
            // Prevenir comportamento padrão de arrastar imagem
            carousel.addEventListener('dragstart', (e) => e.preventDefault());
        
            // Botões de navegação
            prevBtn.addEventListener('click', () => navigate('prev'));
            nextBtn.addEventListener('click', () => navigate('next'));
        
            function touchStart(event) {
                startX = getPositionX(event);
                isDragging = true;
                animationID = requestAnimationFrame(animation);
                carousel.style.cursor = 'grabbing';
            }
        
            function touchMove(event) {
                if (!isDragging) return;
                
                const currentX = getPositionX(event);
                currentTranslate = prevTranslate + currentX - startX;
            }
        
            function touchEnd() {
                isDragging = false;
                cancelAnimationFrame(animationID);
                carousel.style.cursor = 'grab';
        
                const movedBy = currentTranslate - prevTranslate;
                
                // Determinar se houve swipe significativo
                if (Math.abs(movedBy) > 100) {
                    if (movedBy > 0) {
                        navigate('prev');
                    } else {
                        navigate('next');
                    }
                } else {
                    // Voltar para a posição original se o movimento foi pequeno
                    goToSlide(currentIndex);
                }
            }
        
            function getPositionX(event) {
                return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            }
        
            function animation() {
                setSliderPosition();
                if (isDragging) requestAnimationFrame(animation);
            }
        
            function setSliderPosition() {
                carousel.style.transform = `translateX(${currentTranslate}px)`;
            }
        
            function navigate(direction) {
                const slideWidth = items[0].offsetWidth + 20; // 20 é o gap entre slides
                
                if (direction === 'prev' && currentIndex > 0) {
                    currentIndex--;
                } else if (direction === 'next' && currentIndex < items.length - 1) {
                    currentIndex++;
                }
        
                goToSlide(currentIndex);
            }
        
            function goToSlide(index) {
                currentIndex = index;
                const slideWidth = items[0].offsetWidth + 20;
                currentTranslate = prevTranslate = -slideWidth * currentIndex;
                
                carousel.style.transition = 'transform 0.3s ease-out';
                carousel.style.transform = `translateX(${currentTranslate}px)`;
        
                // Atualizar estado dos botões
                updateNavigationButtons();
            }
        
            function updateNavigationButtons() {
                prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
                nextBtn.style.display = currentIndex === items.length - 1 ? 'none' : 'block';
            }
        
            // Ajustar carrossel quando a janela é redimensionada
            window.addEventListener('resize', () => {
                goToSlide(currentIndex);
            });
        
            // Inicializar estado dos botões
            updateNavigationButtons();
        });
        
//carrocel final - 


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