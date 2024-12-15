//----------------------------------------Função para selecionar cidade---------------------------------------------------------------
let selectedCity = '';
let selectedHotel = '';

// icone de clique para expandir menu lateral - inicio
document.getElementById('open_btn').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('open-sidebar');
});
// icone de clique para expandir menu lateral - final

// Carrega próxima viagem na tela inicial - início
document.addEventListener("DOMContentLoaded", function () {
  // Identifica o elemento <section> com a classe "proximaviagem"
  const proximaviagemSection = document.querySelector("section.proximaviagem");

  // Caminho atual da página
  const currentPath = window.location.pathname;

  // Verifica se estamos na página inicial do GitHub Pages
  const isIndexPage =
    currentPath.endsWith("/index.html") ||
    currentPath === "/Projeto_integrador/" || // Caminho base do GitHub Pages
    currentPath === "/Projeto_integrador/index.html";

  if (isIndexPage && proximaviagemSection) {
    // Verifica se há dados armazenados no localStorage
    const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));

    if (dadosViagem) {
      // Extração dos dados armazenados
      const { cidade, dataInicio, cityImage } = dadosViagem;

      if (!cityImage) {
        console.error("A propriedade 'cityImage' não foi encontrada em dadosViagem.");
        return;
      }

      // Cálculo de dias, horas e minutos restantes
      const hoje = new Date();
      const dataInicioDate = new Date(dataInicio);
      const diferencaMs = dataInicioDate - hoje;

      const diasRestantes = Math.max(0, Math.floor(diferencaMs / (1000 * 60 * 60 * 24)));
      const horasRestantes = Math.max(0, Math.floor((diferencaMs / (1000 * 60 * 60)) % 24));
      const minutosRestantes = Math.max(0, Math.floor((diferencaMs / (1000 * 60)) % 60));

      // Criação do conteúdo dinâmico
      const link = document.createElement("a");
      link.href = "src/pages/detalhesviagem.html";
      link.textContent = "Detalhes da viagem >";
      link.className = "card-editar";

      proximaviagemSection.innerHTML = `
        <div class="card">
          <img src="${cityImage}" alt="${cidade}" class="destino-imagem">
          <h3>${cidade}</h3>
          <p>Está chegando!</p>
          <div class="contador">
            <div class="tempo"><span>Dias</span><strong>${diasRestantes}</strong></div>
            <div class="tempo"><span>Horas</span><strong>${horasRestantes}</strong></div>
            <div class="tempo"><span>Minutos</span><strong>${minutosRestantes}</strong></div>
          </div>
          ${link.outerHTML}
        </div>
      `;
    } else {
      // Se não houver dados no localStorage, esconde a seção
      proximaviagemSection.style.display = "none";
    }
  }
});

// Carrega próxima viagem na tela inicial - final

//-------------------------------------Botão voltar a etapa anterior----------------------------------------------------------
  
  // Função para voltar à página anterior
  function goBack() {
    const currentPage = document.querySelector('.main-content > div:not(.hidden)');
    const pages = Array.from(document.querySelectorAll('.main-content > div'));
    const currentIndex = pages.indexOf(currentPage);
  
    if (currentIndex > 0) {
      pages[currentIndex].classList.add('hidden');
      pages[currentIndex - 1].classList.remove('hidden');
    }
  }
  
  // Exemplo de funções para navegação entre páginas
  function showDatesPage() {
    document.getElementById('page-1').classList.add('hidden');
    document.getElementById('page-2').classList.remove('hidden');
  }
  
  function showHotelsPage() {
    document.getElementById('page-2').classList.add('hidden');
    document.getElementById('page-3').classList.remove('hidden');
  }
  
  function showHorario() {
    document.getElementById('page-3').classList.add('hidden');
    document.getElementById('page-4').classList.remove('hidden');
  }

//-------------------------------------------------------------------------------------------------------

// Função para selecionar uma cidade e armazená-la no LocalStorage
function selectCity(city, event) {
  selectedCity = city;

  // Remove a classe 'selected' de todas as cidades para destacar a selecionada
  document.querySelectorAll('.destination').forEach((el) => el.classList.remove('selected'));

  // Adiciona a classe 'selected' à cidade clicada
  event.target.closest('.destination').classList.add('selected');

  // Gera um ID único para a cidade selecionada
  const cityId = Date.now();

  // Obtém o caminho da imagem (src) da cidade selecionada
  const cityImage = event.target.closest('.destination').querySelector('img').src;

  // Cria um objeto com o ID, o nome da cidade e o caminho da imagem
  const cityData = {
    id: cityId,
    name: city,
    image: cityImage,
  };

  // Armazena os dados da cidade selecionada no LocalStorage
  localStorage.setItem('selectedCity', JSON.stringify(cityData));

  // Habilita o botão de continuar
  const button = document.getElementById('continue-btn');
  button.disabled = false;
}

//---------------------------------------- Função para mostrar a página de datas -------------------------------------------------

// Função para mostrar a página de datas e carregar a cidade selecionada
function showDatesPage() {
  // Recupera o nome da cidade do LocalStorage
  const cityFromStorage = localStorage.getItem('selectedCity');

  // Parse o JSON para obter o objeto cidade
  const cityData = JSON.parse(cityFromStorage);

  // Atualiza o campo de entrada com o nome da cidade
  const cityNameInput = document.getElementById('city-name');
  if (cityNameInput) {
    cityNameInput.value = cityData.name; // Use apenas o nome da cidade
  }

  // Mostra a página de datas e oculta a página de seleção de destino
  document.getElementById('page-1').classList.add('hidden');
  document.getElementById('page-2').classList.remove('hidden');
}

//---------------------------------------- Função para validar datas -------------------------------------------------------------

// Função para validar datas e habilitar o botão para seleção de hotéis
function checkDates() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const hotelsButton = document.getElementById('hotels-btn');

  if (startDate && endDate) {
    if (new Date(startDate) > new Date(endDate)) {
      alert('A data de início não pode ser maior que a data de fim.');
      hotelsButton.disabled = true;
    } else {
      hotelsButton.disabled = false;
    }
  } else {
    hotelsButton.disabled = true;
  }
}

//---------------------------------------- Função para mostrar a página de hotéis ------------------------------------------------

// Função para exibir a página de hotéis
function showHotelsPage() {
  // Recupera o nome da cidade do LocalStorage
  const cityFromStorage = localStorage.getItem('selectedCity');

  // Parse o JSON para obter o objeto cidade
  const cityData = JSON.parse(cityFromStorage);

  // Atualiza a variável global com o nome da cidade
  selectedCity = cityData.name;

  // Atualiza o texto da cidade na página de hotéis
  const selectedCityElement = document.getElementById('selected-city');
  if (selectedCityElement) {
    selectedCityElement.textContent = selectedCity;
  }

  // Mostra a página de hotéis e oculta a página de datas
  document.getElementById('page-2').classList.add('hidden');
  document.getElementById('page-3').classList.remove('hidden');
}
//---------------------------------------- Função para carregar dados ao carregar a página --------------------------------------

function loadRoteiroFromLocalStorage() {
  const storedData = localStorage.getItem('dadosViagem');

  if (storedData) {
    const { cidade, dataInicio, dataFim } = JSON.parse(storedData);

    if (isNaN(new Date(dataInicio)) || isNaN(new Date(dataFim))) {
      console.error('As datas no localStorage estão em um formato inválido.');
      return;
    }

    const nomeCidadeElement = document.getElementById('nome-cidade');
    if (nomeCidadeElement) {
      nomeCidadeElement.textContent = `${cidade}`;
    } else {
      console.error('Elemento com id "nome-cidade" não encontrado.');
    }
  }
}

//---------------------------------------- Configuração de eventos para hotéis ---------------------------------------------------

// Dados dos hotéis disponíveis
const hotels = {
  1: { name: "Atlantic Bussines ★★★★☆", image: "../assets/imagens/hotel-1-desc.jpg", description: "Situado no centro do Rio de Janeiro e a 4 minutos a pé da estação de metrô Cinelândia, este hotel informal fica a 11 minutos a pé do Museu de Arte Moderna do Rio de Janeiro e a 1,2 km do Aeroporto Santos Dumont." },
  2: { name: "Hotel Nacional", image: "../assets/imagens/hotel-2.jpg", description: "Detalhes do Hotel 2." },
  3: { name: "Hotel Comfort", image: "../assets/imagens/hotel-3.jpg", description: "Detalhes do Hotel 3." }
};

// Seleção e detalhes das etapas dos hotéis
const hotelSelectionStep = document.getElementById("hotel-selection");
const hotelDetailsStep = document.getElementById("hotel-details");
const hotelConfirmationStep = document.getElementById("hotel-confirmation");

// Elementos de detalhes do hotel
const hotelDetailsImage = document.getElementById("hotel-image");
const hotelDetailsName = document.getElementById("hotel-name");
const hotelDetailsDescription = document.getElementById("hotel-description");

const confirmHotelImage = document.getElementById("confirm-hotel-image");
const confirmHotelName = document.getElementById("confirm-hotel-name");

let selectedHotelId = null;

// Configuração de evento para cartões de hotéis
document.querySelectorAll(".hotel-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedHotelId = card.dataset.hotelId;
    const hotel = hotels[selectedHotelId];

    if (hotel) {
      hotelDetailsImage.src = hotel.image;
      hotelDetailsName.textContent = hotel.name;
      hotelDetailsDescription.textContent = hotel.description;
      selectedHotel = hotel.name;
      hotelSelectionStep.classList.add("hidden");
      hotelDetailsStep.classList.remove("hidden");
    }
  });
});

// Evento para continuar para a confirmação
document.getElementById("continue-to-confirmation")?.addEventListener("click", () => {
  const hotel = hotels[selectedHotelId];
  if (hotel) {
    confirmHotelImage.src = hotel.image;
    confirmHotelName.textContent = hotel.name;
    hotelDetailsStep.classList.add("hidden");
    hotelConfirmationStep.classList.remove("hidden");
  }
});

// Evento para remover hotel
document.getElementById("remove-hotel")?.addEventListener("click", () => {
  selectedHotelId = null;
  hotelConfirmationStep.classList.add("hidden");
  hotelSelectionStep.classList.remove("hidden");
});

//-------------------------------------------------------------------------------------------------------
  
  // Evento para continuar para a próxima etapa
  document.getElementById("continue-to-next")?.addEventListener("click", () => {
    alert("Próxima etapa!");
  });
  
  // Evento para adicionar nova tarefa
  document.querySelectorAll('.add-task').forEach(button => {
    button.addEventListener('click', () => {
      alert('Adicionar nova tarefa');
    });
  });
  
  // Função para mostrar a página de horários
  function showHorario() {
    document.getElementById('page-3').classList.add('hidden');
    document.getElementById('page-4').classList.remove('hidden');
  }
  
 // Função para calcular e validar a criação de passeios
function QtdPasseios() {
  event.preventDefault();

  // Recupera os dados da cidade selecionada do LocalStorage
  const selectedCityData = JSON.parse(localStorage.getItem('selectedCity'));
  
  if (!selectedCityData) {
    alert('Por favor, selecione uma cidade antes de continuar.');
    return false;
  }

  const { id: cityId, name: cidade, image: cityImage } = selectedCityData;

  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const hotelName = selectedHotel;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;

  // Validação para garantir que todos os campos estão preenchidos
  if (!cidade || !startDate || !endDate || !hotelName || !startTime || !endTime) {
    alert('Por favor, preencha todos os campos antes de continuar.');
    return false;
  }

  // Criação do objeto com os dados completos da viagem
  const destination = {
    id: cityId,           // ID da cidade
    cidade: cidade,       // Nome da cidade
    cityImage: cityImage, // Caminho da imagem da cidade
    dataInicio: startDate,
    dataFim: endDate,
    hotel: hotelName,
    horarioInicio: startTime,
    horarioFim: endTime
  };

  try {
    // Armazena os dados da viagem no LocalStorage
    localStorage.setItem('dadosViagem', JSON.stringify(destination));
    window.location.href = 'https://daniiell99e.github.io/Projeto_integrador/src/pages/SeusRoteiros.html';

  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    alert('Ocorreu um erro ao salvar os dados. Por favor, tente novamente.');

  }
}
  
  // Função para calcular dias entre duas datas
  function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return difference + 1;
  }
  
  // Função para formatar datas
  function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'long' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  }
  
  // Função para criar HTML do Kanban
  function createBaiaHTML(dataInicio, dataFim) {
    const kanbanContainer = document.querySelector('.kanban');
    kanbanContainer.innerHTML = '';
  
    const totalDays = calculateDaysBetween(dataInicio, dataFim);
  
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(dataInicio + "T00:00:00");
      currentDate.setDate(currentDate.getDate() + i);
  
      const formattedDate = formatDate(currentDate);
  
      const baiaHTML = `
        <div class="day-column">
          <div class="day-header">Dia ${i + 1} | ${formattedDate}</div>
          <div class="task-card">
            <button class="add-task">+</button>
          </div>
        </div>
      `;
      kanbanContainer.innerHTML += baiaHTML;
    }
  }
  
  // Função para carregar o roteiro do LocalStorage
  function loadRoteiroFromLocalStorage() {
    const storedData = localStorage.getItem('dadosViagem');
  
    if (storedData) {
      const { cidade, dataInicio, dataFim } = JSON.parse(storedData);
  
      if (isNaN(new Date(dataInicio)) || isNaN(new Date(dataFim))) {
        console.error('As datas no localStorage estão em um formato inválido.');
        return;
      }
  
      const nomeCidadeElement = document.getElementById('nome-cidade');
      if (nomeCidadeElement) {
        nomeCidadeElement.textContent = `${cidade}`;
      } else {
        console.error('Elemento com id "nome-cidade" não encontrado.');
      }
  
      createBaiaHTML(dataInicio, dataFim);
    }
  }
  
  // Carregar roteiro ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    loadRoteiroFromLocalStorage();
    
    const form = document.getElementById('new-itinerary-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        QtdPasseios();
      });
    }
  });

  
  
//----------------------------------------------------------------------------------------------

// Estrutura de dados para armazenar os passeios
let tours = JSON.parse(localStorage.getItem('tours')) || [];

// Função para abrir o modal de cadastro
function openModal() {
  const modal = document.getElementById('tourModal');
  modal.style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById('tourModal');
  modal.style.display = 'none';
  clearForm();
}

// Função para limpar o formulário
function clearForm() {
  document.getElementById('tourForm').reset();
  const form = document.getElementById('tourForm');
  form.removeAttribute('data-editing-id');
}

// Função para salvar ou atualizar um passeio
function saveOrUpdateTour(event) {
  event.preventDefault();
  const form = document.getElementById('tourForm');
  const editingId = form.getAttribute('data-editing-id');
  const activeColumn = document.querySelector('.day-column.active');
  const selectedDate = activeColumn ? activeColumn.querySelector('.day-header').textContent.split('|')[1].trim() : '';

  // Obter dados de cidade do localStorage
  const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));
  const cidadeId = dadosViagem ? dadosViagem.id : null;
  const cidadeNome = dadosViagem ? dadosViagem.cidade : null;

  const tourData = {
    name: document.getElementById('tourName').value,
    duration: document.getElementById('tourDuration').value,
    price: document.getElementById('tourPrice').value,
    description: document.getElementById('tourDescription').value,
    location: document.getElementById('tourLocation').value,
    category: document.getElementById('tourCategory').value,
    date: selectedDate,
    cidadeId: cidadeId,
    cidadeNome: cidadeNome
  };

  if (editingId) {
    // Atualizar passeio existente
    updateTour(parseInt(editingId), tourData);
  } else {
    // Salvar novo passeio
    const tour = {
      id: Date.now(),
      ...tourData,
      createdAt: new Date().toISOString()
    };
    tours.push(tour);
    localStorage.setItem('tours', JSON.stringify(tours));
    addTourToColumn(tour);
  }

  closeModal();
}

// Função para adicionar passeio à coluna do dia correto
function addTourToColumn(tour) {
  const dayColumns = document.querySelectorAll('.day-column');
  dayColumns.forEach(column => {
    const header = column.querySelector('.day-header').textContent;
    if (header.includes(tour.date)) {
      const taskCard = column.querySelector('.task-card');
      const tourElement = createTourElement(tour);
      taskCard.appendChild(tourElement);
    }
  });
}

// Criar elemento de passeio
function createTourElement(tour) {
  const tourElement = document.createElement('div');
  tourElement.className = 'tour-card';
  tourElement.setAttribute('data-tour-id', tour.id);
  
  tourElement.innerHTML = `
    <div class="tour-content">
      <h4>${tour.name}</h4>
      <div class="tour-details">
        <span class="duration"><i class="far fa-clock"></i> ${tour.duration}</span>
        <span class="price"><i class="fas fa-tag"></i> R$ ${tour.price}</span>
      </div>
      <p class="location"><i class="fas fa-map-marker-alt"></i> ${tour.location}</p>
      <p class="description">${tour.description}</p>
      <span class="category">${tour.category}</span>
      <div class="tour-actions">
        <button onclick="editTour(${tour.id})" class="edit-btn">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button onclick="removeTour(${tour.id})" class="remove-btn">
          <i class="fas fa-trash"></i> Remover
        </button>
      </div>
    </div>
  `;
  
  return tourElement;
}

// Função para remover um passeio
function removeTour(tourId) {
  const confirmDelete = confirm('Tem certeza que deseja remover este passeio?');
  
  if (confirmDelete) {
    tours = tours.filter(tour => tour.id !== tourId);
    localStorage.setItem('tours', JSON.stringify(tours));
    
    const tourElement = document.querySelector(`[data-tour-id="${tourId}"]`);
    if (tourElement) {
      tourElement.remove();
    }
  }
}

// Função para editar um passeio
function editTour(tourId) {
  const tour = tours.find(t => t.id === tourId);
  if (!tour) return;
  
  document.getElementById('tourName').value = tour.name;
  document.getElementById('tourDuration').value = tour.duration;
  document.getElementById('tourPrice').value = tour.price;
  document.getElementById('tourDescription').value = tour.description;
  document.getElementById('tourLocation').value = tour.location;
  document.getElementById('tourCategory').value = tour.category;
  
  // Mudar o comportamento do formulário para atualização
  const form = document.getElementById('tourForm');
  form.setAttribute('data-editing-id', tourId);
  
  openModal();
}

// Função para atualizar um passeio existente
function updateTour(tourId, updatedData) {
  tours = tours.map(tour => {
    if (tour.id === tourId) {
      return { ...tour, ...updatedData };
    }
    return tour;
  });
  
  localStorage.setItem('tours', JSON.stringify(tours));
  
  const tourElement = document.querySelector(`[data-tour-id="${tourId}"]`);
  if (tourElement) {
    tourElement.querySelector('h4').textContent = updatedData.name;
    tourElement.querySelector('.duration').innerHTML = `<i class="far fa-clock"></i> ${updatedData.duration}`;
    tourElement.querySelector('.price').innerHTML = `<i class="fas fa-tag"></i> R$ ${updatedData.price}`;
    tourElement.querySelector('.location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${updatedData.location}`;
    tourElement.querySelector('.description').textContent = updatedData.description;
    tourElement.querySelector('.category').textContent = updatedData.category;
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Carregar passeios do localStorage
  tours.forEach(addTourToColumn);
  
  // Adicionar event listener para o botão de adicionar passeio
  const addButtons = document.querySelectorAll('.add-task');
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      openModal();
      // Definir a coluna ativa
      document.querySelectorAll('.day-column').forEach(column => column.classList.remove('active'));
      button.closest('.day-column').classList.add('active');
    });
  });
  
  // Adicionar event listener para fechar o modal
  const closeButton = document.querySelector('.close-modal');
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
  
  // Fechar modal quando clicar fora dele
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('tourModal');
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Adicionar event listener para o formulário
  const form = document.getElementById('tourForm');
  if (form) {
    form.addEventListener('submit', saveOrUpdateTour);
  }
});

//tela de detalhes da viagem - inicio----------------------------------------------------------------------------------------------
function updateCountdown() {
  const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));
  const travelDate = new Date(`${dadosViagem.dataInicio}T00:00:00Z`); // Adiciona 'Z' para forçar UTC
  const now = new Date();
  const difference = travelDate - now;

  const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((difference / (1000 * 60)) % 60));

  document.getElementById('countdown').innerHTML = 
      `Contagem Regressiva: ${days} dias, ${hours} horas, ${minutes} minutos`;
}

function checkPage() {
  const currentPage = window.location.pathname;
  if (currentPage.includes('detalhesviagem.html')) {
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Chama imediatamente para evitar atraso inicial
  }
}

checkPage();

//função para atualizar o nome da cidade na tela de detalhes da viagem-----------------------------
function updateCityName() {
  const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));
  const cityName = dadosViagem.cidade;

  document.querySelector(".header-detViagem h1 span").textContent = cityName;
}

document.addEventListener("DOMContentLoaded", updateCityName);

//função para atualizar foto da cidade na tela de detalhes da viagem-----------------------------
function updateCityImage() {
  const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));
  const cityImage = dadosViagem.cityImage;

  document.querySelector(".details-detViagem img").src = cityImage;
}

document.addEventListener("DOMContentLoaded", updateCityImage);

//função para atualizar data da viagem na tela de detalhes da viagem-----------------------------
function updateTravelDate() {
  const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));
  const travelDate = dadosViagem.dataInicio;
  const travelEndDate = dadosViagem.dataFim;

  const diferencaEmDias = calcularDiasViagem(travelDate, travelEndDate);

  const dataInicioFormatada = formatarData(travelDate);
  const dataFimFormatada = formatarData(travelEndDate);

  document.querySelector(".details-detViagem_dataInicio span").textContent = dataInicioFormatada;
  document.querySelector(".details-detViagem_dataFim span").textContent = dataFimFormatada;
  document.querySelector(".details-detViagem_duracao span").textContent = diferencaEmDias + " dias";
}

function calcularDiasViagem(dataInicio, dataFim) {
  const dataInicioObj = new Date(dataInicio);
  const dataFimObj = new Date(dataFim);

  const diferencaEmMilissegundos = dataFimObj - dataInicioObj;
  const diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

  return diferencaEmDias;
}

function formatarData(data) {
  const dataObj = new Date(data);
  dataObj.setDate(dataObj.getDate() + 1); // Adiciona um dia à data
  const dia = dataObj.getDate();
  const mes = getMes(dataObj.getMonth());
  const ano = dataObj.getFullYear();

  return `${dia} de ${mes} de ${ano}`;
}

function getMes(mes) {
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return meses[mes];
}

document.addEventListener("DOMContentLoaded", updateTravelDate);

//função para atualizar o nome da cidade na tela de detalhes da viagem-----------------------------
function updateCityDestino() {
  const dadosViagem = JSON.parse(localStorage.getItem("dadosViagem"));
  const cityName = dadosViagem.cidade;

  document.querySelector(".details-detViagem_destino span").textContent = cityName;
}

document.addEventListener("DOMContentLoaded", updateCityDestino);

//função para editar datas na tela de detalhes da viagem---------------------------------------------
// Função para ir para a página de edição de datas
function goToEditPage() {
  // Mostra a página de edição de datas em pop-up
  const editPage = document.getElementById("details-edit_dates");
  editPage.classList.remove("hidden");
  editPage.style.position = "fixed";
  editPage.style.top = "45%";
  editPage.style.left = "59%";
  editPage.style.transform = "translate(-50%, -50%)";
  editPage.style.zIndex = "1000";
  editPage.style.width = "79%";
  // Chama a função atualizarDetalhesViagem
  atualizarDetalhesViagem();
}

function atualizarDetalhesViagem() {
  const dadosViagem = JSON.parse(localStorage.getItem('dadosViagem'));
  // Atualiza o campo de entrada com o nome da cidade
  const cityNameInput = document.getElementById('city-name_edit');
  if (cityNameInput) {
    cityNameInput.value = dadosViagem.cidade;
  }
  // Atualiza os campos de data
  const startDateInput = document.getElementById('start-date_edit');
  if (startDateInput) {
    startDateInput.value = dadosViagem.dataInicio;
  }
  const endDateInput = document.getElementById('end-date_edit');
  if (endDateInput) {
    endDateInput.value = dadosViagem.dataFim;
  }
  verificarDatas();
}

function verificarDatas() {
  const startDateInput = document.getElementById('start-date_edit');
  const endDateInput = document.getElementById('end-date_edit');
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  if (startDate >= endDate) {
    alert("A data de início deve ser anterior à data de fim");
  }
}

// Função para salvar as alterações e voltar para a tela de detalhes
function salvarAlteracoes() {
  // Pega os novos valores dos campos de data
  const startDateInput = document.getElementById('start-date_edit');
  const endDateInput = document.getElementById('end-date_edit');
  // Atualiza o localStorage com os novos valores
  const dadosViagem = JSON.parse(localStorage.getItem('dadosViagem'));
  dadosViagem.dataInicio = startDateInput.value;
  dadosViagem.dataFim = endDateInput.value;
  localStorage.setItem('dadosViagem', JSON.stringify(dadosViagem));
  // Volta para a tela de detalhes
  const editPage = document.getElementById("details-edit_dates");
  editPage.classList.add("hidden");
  // Recarrega a página
  location.reload();
}

function fecharEditPage() {
  const editPage = document.getElementById("details-edit_dates");
  editPage.classList.add("hidden");
}
//tela de detalhes da viagem - final----------------------------------------------------------------------------------------------
  
  
  //----------------------------------------------------------------------------------------------

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
      
//----------------------------------------------------------------------------------------------------------

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





