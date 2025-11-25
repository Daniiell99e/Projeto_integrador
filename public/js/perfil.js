document.addEventListener('DOMContentLoaded', function () {

    let currentUserId = null;
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/public/index.html';
        return;
    }

    const API_PROFILE_URL = 'http://localhost:3333/user/profile';
    const API_ROTEIROS_URL = 'http://localhost:3333/roteiros'; // [NOVO] Rota de roteiros
    const API_DELETE_URL = 'http://localhost:3333/user';
    const fieldMapping = {
        'nome': 'name',
        'email': 'email',
        'telefone': 'telefone',
        'cidade': 'cidade',
        'pais': 'pais',
        'bio': 'biografia',
        'nascimento': 'data_nascimento',
        'instagram': 'rede_social'
    };

    // --- LÓGICA DE CARREGAMENTO (PERFIL) ---
    async function fetchAndLoadProfile() {
        try {
            const response = await fetch(API_PROFILE_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao buscar perfil');

            const userData = await response.json();
            currentUserId = userData.id;

            loadProfileInfo(userData);

        } catch (error) {
            console.error("Falha:", error);
            const nameEl = document.getElementById('user-profile-name');
            if (nameEl) nameEl.textContent = "Erro ao carregar";
        }
    }

    // --- LÓGICA DE CARREGAMENTO (ROTEIROS) ---
    async function fetchUserRoteiros() {
        try {
            const response = await fetch(API_ROTEIROS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao buscar roteiros');

            const roteiros = await response.json();

            loadHistory(roteiros);

        } catch (error) {
            console.error("Erro roteiros:", error);
            const historyListContainer = document.getElementById('history-list-container');
            if (historyListContainer) historyListContainer.innerHTML = '<p style="color: #d32f2f; padding: 20px;">Erro ao carregar histórico.</p>';
        }
    }

    function loadProfileInfo(data) {
        const userNameElement = document.getElementById('user-profile-name');
        const userPicElement = document.getElementById('user-profile-pic');

        if (userNameElement) userNameElement.textContent = data.name || "Usuário";
        if (userPicElement && data.url_foto_perfil) userPicElement.src = data.url_foto_perfil;

        for (const [htmlField, dbField] of Object.entries(fieldMapping)) {
            const dbValue = data[dbField];
            const pElement = document.querySelector(`.view-mode[data-field="${htmlField}"]`);
            const inputElement = document.querySelector(`.edit-mode[data-field="${htmlField}"]`);

            if (pElement) {
                if (htmlField === 'nascimento' && dbValue) {
                    const dateObj = new Date(dbValue);
                    pElement.textContent = dateObj.toLocaleDateString('pt-BR');
                } else {
                    pElement.textContent = dbValue || '';
                }
            }

            if (inputElement) {
                if (inputElement.type === 'date' && dbValue) {
                    const dateObj = new Date(dbValue);
                    inputElement.value = dateObj.toISOString().split('T')[0];
                } else {
                    inputElement.value = dbValue || '';
                }
            }
        }
    }

    // --- HISTÓRICO ---
    function loadHistory(roteiros) {
        const historyListContainer = document.getElementById('history-list-container');
        if (!historyListContainer) return;

        historyListContainer.innerHTML = '';

        if (!roteiros || roteiros.length === 0) {
            historyListContainer.innerHTML = '<p style="color: var(--cor-subtitulo); padding: 20px;">Você ainda não tem roteiros criados.</p>';
            return;
        }

        roteiros.forEach(roteiro => {
            let statusClass = 'status-planejado';
            let statusText = 'Planejado';

            const dataFim = new Date(roteiro.data_inicio);
            dataFim.setDate(dataFim.getDate() + roteiro.duracao_dias);

            if (new Date() > dataFim) {
                statusClass = 'status-concluido';
                statusText = 'Concluído';
            }

            const dataFormatada = new Date(roteiro.data_inicio).toLocaleDateString('pt-BR');
            const imgUrl = roteiro.cidade?.url_imagem || 'https://via.placeholder.com/60x60?text=Roteiro';

            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <img src="${imgUrl}" alt="Thumbnail ${roteiro.titulo}" class="history-item-img">
                <div class="history-item-info">
                    <h3>${roteiro.titulo}</h3>
                    <p>${dataFormatada} • ${roteiro.duracao_dias} dias</p>
                </div>
                <div class="history-item-status">
                    <span class="status-tag ${statusClass}">${statusText}</span>
                        <a href="/public/pages/roteiro-diario.html?id=${roteiro.id}" class="view-link">Ver</a>
                    <i class="fas fa-map-marker-alt map-icon" title="Ver Mapa"></i>
                </div>
            `;
            historyListContainer.appendChild(li);
        });
    }

    // --- INICIALIZAÇÃO ---
    fetchAndLoadProfile();
    fetchUserRoteiros();

    // --- LÓGICA DE INTERFACE (Abas, Edição, Modal, etc.) ---

    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.details-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const targetContent = document.getElementById(this.getAttribute('data-tab'));
            if (targetContent) targetContent.classList.add('active');
        });
    });

    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const profileForm = document.getElementById('dados-pessoais');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (editProfileBtn) editProfileBtn.addEventListener('click', () => profileForm.classList.add('is-editing'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        profileForm.classList.remove('is-editing');
        fetchAndLoadProfile();
    });

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function (event) {
            event.preventDefault();
            profileForm.querySelectorAll('.edit-mode').forEach(input => {
                const fieldName = input.dataset.field;
                const p = profileForm.querySelector(`.view-mode[data-field="${fieldName}"]`);
                if (p) p.textContent = input.value;
            });
            profileForm.classList.remove('is-editing');
            alert("Alterações visuais aplicadas. (Salvar no banco pendente)");
        });
    }

    const cameraIcon = document.querySelector('.camera-icon');
    const fileUploadInput = document.getElementById('file-upload-input');
    const profilePicImg = document.getElementById('user-profile-pic');

    if (cameraIcon && fileUploadInput) {
        cameraIcon.addEventListener('click', () => fileUploadInput.click());
        fileUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => { if (profilePicImg) profilePicImg.src = ev.target.result; };
                reader.readAsDataURL(file);
            }
        });
    }

    const settingsBtn = document.getElementById('open-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    if (settingsBtn && settingsModal) settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    if (cancelSettingsBtn && settingsModal) cancelSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            if (!currentUserId) { alert("Erro: ID não encontrado."); return; }
            if (confirm("Tem certeza ABSOLUTA?")) {
                try {
                    const response = await fetch(`${API_DELETE_URL}/${currentUserId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        alert("Conta excluída.");
                        localStorage.clear();
                        window.location.href = '/public/index.html';
                    } else {
                        alert("Erro ao excluir.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Erro de conexão.");
                }
            }
        });
    }

    window.onclick = function (event) {
        if (settingsModal && event.target == settingsModal) settingsModal.style.display = "none";
        const mapModal = document.getElementById('map-modal');
        if (mapModal && event.target == mapModal) mapModal.style.display = "none";
    }

    const mapModal = document.getElementById('map-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const googleMapIframe = document.getElementById('google-map-iframe');
    if (closeModalBtn && mapModal) {
        closeModalBtn.addEventListener('click', () => {
            mapModal.style.display = 'none';
            if (googleMapIframe) googleMapIframe.src = '';
        });
    }
});