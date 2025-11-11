document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA UPLOAD DA FOTO DE PERFIL ---
    const cameraIcon = document.querySelector('.camera-icon');
    const fileUploadInput = document.getElementById('file-upload-input');
    const profilePicImg = document.getElementById('user-profile-pic');

    if (cameraIcon && fileUploadInput && profilePicImg) {
        
        cameraIcon.addEventListener('click', function() {
            fileUploadInput.click();
        });

        fileUploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    profilePicImg.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // --- LÓGICA DE CARREGAMENTO DE DADOS (Fetch) ---
    async function fetchAndLoadProfile() {
        try {
            const response = await fetch('../js/profile-data.json');
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar o arquivo: ${response.statusText}`);
            }

            const data = await response.json();
            
            loadProfileInfo(data);
            loadHistory(data.history);
            
            const cancelBtn = document.getElementById('cancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    loadProfileInfo(data);
                    document.getElementById('dados-pessoais').classList.remove('is-editing');
                });
            }

        } catch (error) {
            console.error("Falha ao carregar dados do perfil:", error);
            document.getElementById('user-profile-name').textContent = "Erro ao carregar perfil.";
        }
    }

    // --- Função para carregar os "Dados Pessoais" ---
    function loadProfileInfo(data) {
        const userNameElement = document.getElementById('user-profile-name');
        const userPicElement = document.getElementById('user-profile-pic');

        if (userNameElement) {
            userNameElement.textContent = data.personalInfo.nome;
        }
        // Só atualiza a foto se ela ainda for o placeholder
        if (userPicElement && userPicElement.src.includes('blank-profile-picture')) {
             userPicElement.src = data.profilePictureUrl;
        }

        for (const [key, value] of Object.entries(data.personalInfo)) {
            const pElement = document.querySelector(`.view-mode[data-field="${key}"]`);
            if (pElement) {
                pElement.textContent = value;
            }
            
            const inputElement = document.querySelector(`.edit-mode[data-field="${key}"]`);
            if (inputElement) {
                if (inputElement.type === 'date') {
                    const dateParts = value.split('/');
                    if (dateParts.length === 3) {
                        inputElement.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    }
                } else {
                    inputElement.value = value;
                }
            }
        }
    }

    // --- Função para carregar o "Histórico" (com ícone GPS) ---
    function loadHistory(history) {
        const historyListContainer = document.getElementById('history-list-container');
        if (!historyListContainer) return;

        historyListContainer.innerHTML = '';
        
        if (history.length === 0) {
            historyListContainer.innerHTML = '<p style="color: var(--cor-subtitulo);">Nenhum roteiro no histórico.</p>';
            return;
        }

        history.forEach(item => {
            let statusHtml = '';
            if (item.status === 'Concluído') statusHtml = '<span class="status-tag status-concluido">Concluído</span>';
            else if (item.status === 'Em andamento') statusHtml = '<span class="status-tag status-andamento">Em andamento</span>';
            else if (item.status === 'Planejado') statusHtml = '<span class="status-tag status-planejado">Planejado</span>';

            let ratingHtml = '';
            if (item.rating > 0) {
                ratingHtml = '<div class="rating">';
                for(let i = 0; i < 5; i++) { ratingHtml += `<i class="${i < item.rating ? 'fas' : 'far'} fa-star"></i>`; }
                ratingHtml += '</div>';
            }

            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <img src="${item.thumbnailUrl}" alt="Thumbnail do roteiro ${item.title}" class="history-item-img">
                <div class="history-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.date}</p>
                </div>
                <div class="history-item-status">
                    ${statusHtml}
                    ${ratingHtml}
                    <a href="#" class="view-link">Ver</a>
                    ${item.mapLocation ? `<i class="fas fa-map-marker-alt map-icon" data-map-query="${item.mapLocation}" data-map-title="${item.title}"></i>` : ''}
                </div>
            `;
            historyListContainer.appendChild(li);
        });

        // Adiciona listeners para os novos ícones de mapa
        document.querySelectorAll('.map-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const mapQuery = this.dataset.mapQuery;
                const mapTitle = this.dataset.mapTitle;
                openMapModal(mapQuery, mapTitle);
            });
        });
    }

    // Chama a função principal para iniciar o carregamento
    fetchAndLoadProfile();
    

    // --- LÓGICA DAS ABAS ---
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.details-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const targetContent = document.getElementById(this.getAttribute('data-tab'));
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // --- LÓGICA DE EDIÇÃO DO FORMULÁRIO ---
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const profileForm = document.getElementById('dados-pessoais');
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            profileForm.classList.add('is-editing');
            profileForm.querySelectorAll('.view-mode').forEach(p => {
                const fieldName = p.dataset.field;
                const input = profileForm.querySelector(`.edit-mode[data-field="${fieldName}"]`);
                if (input) {
                    if (input.type === 'date') {
                        const dateParts = p.textContent.trim().split('/');
                        if (dateParts.length === 3) {
                            input.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                        }
                    } else {
                        input.value = p.textContent.trim();
                    }
                }
            });
        });
    }

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function(event) {
            event.preventDefault();
            profileForm.querySelectorAll('.edit-mode').forEach(input => {
                const fieldName = input.dataset.field;
                const p = profileForm.querySelector(`.view-mode[data-field="${fieldName}"]`);
                if (p) {
                    if (input.type === 'date') {
                        const dateParts = input.value.split('-');
                         if (dateParts.length === 3 && input.value) {
                            p.textContent = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                        } else {
                            p.textContent = '';
                        }
                    } else {
                        p.textContent = input.value;
                    }
                }
            });
            profileForm.classList.remove('is-editing');
        });
    }


    // --- LÓGICA DO MODAL DO MAPA ---
    const mapModal = document.getElementById('map-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const googleMapIframe = document.getElementById('google-map-iframe');
    const modalMapTitle = document.getElementById('modal-map-title');

    function openMapModal(query, title) {
        const encodedQuery = encodeURIComponent(query);
        const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        
        googleMapIframe.src = mapUrl;
        modalMapTitle.textContent = `Localização: ${title}`;
        mapModal.style.display = 'flex';
    }

    function closeMapModal() {
        mapModal.style.display = 'none';
        googleMapIframe.src = '';
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeMapModal);
    }

    if (mapModal) {
        mapModal.addEventListener('click', function(event) {
            if (event.target === mapModal) {
                closeMapModal();
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mapModal.style.display === 'flex') {
            closeMapModal();
        }
    });

});