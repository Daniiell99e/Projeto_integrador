document.addEventListener('DOMContentLoaded', function() {
    
    // --- VARIÁVEIS GLOBAIS ---
    let currentUserId = null;

    // 1. Verifica Token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/public/index.html'; // Redireciona se não estiver logado
        return;
    }

    // 2. Configuração da API
    const API_PROFILE_URL = 'http://localhost:3333/user/profile';
    const API_DELETE_URL = 'http://localhost:3333/user'; // + ID

    // 3. Mapeamento: [Nome no HTML (data-field)] : [Nome no Banco de Dados]
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

    // --- LÓGICA DE CARREGAMENTO ---
    async function fetchAndLoadProfile() {
        try {
            const response = await fetch(API_PROFILE_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao buscar perfil');
            }

            const userData = await response.json();
            
            // Salva o ID para uso futuro (ex: deletar conta)
            currentUserId = userData.id;

            // Preenche a tela com os dados reais
            loadProfileInfo(userData);

            // Por enquanto, o histórico continua vazio ou mockado 
            // (futuramente buscaremos de '/user/roteiros')
            loadHistory([]); 

        } catch (error) {
            console.error("Falha:", error);
            const nameEl = document.getElementById('user-profile-name');
            if(nameEl) nameEl.textContent = "Erro ao carregar";
        }
    }

    function loadProfileInfo(data) {
        const userNameElement = document.getElementById('user-profile-name');
        const userPicElement = document.getElementById('user-profile-pic');

        // Atualiza Header (Nome e Foto)
        if (userNameElement) userNameElement.textContent = data.name || "Usuário sem nome";
        
        // Se tiver foto no banco, usa. Se não, mantém o placeholder do HTML.
        if (userPicElement && data.url_foto_perfil) {
             userPicElement.src = data.url_foto_perfil;
        }

        // Atualiza Formulário "Dados Pessoais"
        for (const [htmlField, dbField] of Object.entries(fieldMapping)) {
            const dbValue = data[dbField]; // Pega valor do banco

            // Atualiza Texto (View Mode)
            const pElement = document.querySelector(`.view-mode[data-field="${htmlField}"]`);
            if (pElement) {
                // Se for data, formata para DD/MM/AAAA
                if (htmlField === 'nascimento' && dbValue) {
                    const dateObj = new Date(dbValue);
                    pElement.textContent = dateObj.toLocaleDateString('pt-BR');
                } else {
                    pElement.textContent = dbValue || ''; // Deixa vazio se null
                }
            }
            
            // Atualiza Input (Edit Mode)
            const inputElement = document.querySelector(`.edit-mode[data-field="${htmlField}"]`);
            if (inputElement) {
                if (inputElement.type === 'date' && dbValue) {
                    // O input date precisa de AAAA-MM-DD
                    const dateObj = new Date(dbValue);
                    // Ajuste simples para fuso horário ao converter para ISO
                    const isoDate = dateObj.toISOString().split('T')[0];
                    inputElement.value = isoDate;
                } else {
                    inputElement.value = dbValue || '';
                }
            }
        }
    }

    // --- HISTÓRICO (Mantido simples por enquanto) ---
    function loadHistory(history) {
        const historyListContainer = document.getElementById('history-list-container');
        if (!historyListContainer) return;
        historyListContainer.innerHTML = '';
        
        if (!history || history.length === 0) {
            historyListContainer.innerHTML = '<p style="color: var(--cor-subtitulo); padding: 20px;">Você ainda não tem roteiros no histórico.</p>';
            return;
        }
        // (Aqui entraria o loop forEach se tivéssemos dados de histórico)
    }

    // Inicializa o carregamento
    fetchAndLoadProfile();


    // =========================================================
    // --- LÓGICA DE INTERFACE (Abas, Edição, Modal, etc.) ---
    // =========================================================
    
    // 1. Abas
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

    // 2. Botão Editar/Salvar/Cancelar
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const profileForm = document.getElementById('dados-pessoais');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            profileForm.classList.add('is-editing');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            profileForm.classList.remove('is-editing');
            fetchAndLoadProfile(); // Reseta os campos para o valor original do banco
        });
    }
    
    // AQUI SERÁ A LÓGICA DE SALVAR (PUT) NO FUTURO
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function(event) {
            event.preventDefault();
            // Por enquanto apenas fecha visualmente
            
            // Atualiza visualmente os <p> com o que está no <input>
            profileForm.querySelectorAll('.edit-mode').forEach(input => {
                const fieldName = input.dataset.field;
                const p = profileForm.querySelector(`.view-mode[data-field="${fieldName}"]`);
                if(p) p.textContent = input.value;
            });

            profileForm.classList.remove('is-editing');
            alert("Lembre-se: Os dados ainda não estão sendo salvos no banco (Falta implementar o PUT).");
        });
    }

    // 3. Upload Foto (Visual)
    const cameraIcon = document.querySelector('.camera-icon');
    const fileUploadInput = document.getElementById('file-upload-input');
    const profilePicImg = document.getElementById('user-profile-pic');

    if (cameraIcon && fileUploadInput) {
        cameraIcon.addEventListener('click', () => fileUploadInput.click());
        fileUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => { 
                    if(profilePicImg) profilePicImg.src = ev.target.result; 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Modal de Configurações (Excluir Conta)
    const settingsBtn = document.getElementById('open-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    // Abrir Modal
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });
    }

    // Fechar Modal
    if (cancelSettingsBtn && settingsModal) {
        cancelSettingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }

    // Ação de Excluir Conta
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            if (!currentUserId) {
                alert("Erro: ID do usuário não encontrado.");
                return;
            }

            const confirmDelete = confirm("Tem certeza ABSOLUTA? Todos os seus dados serão apagados.");
            
            if (confirmDelete) {
                try {
                    const response = await fetch(`${API_DELETE_URL}/${currentUserId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        alert("Sua conta foi excluída com sucesso. Sentiremos sua falta!");
                        // Limpa dados e redireciona para login
                        localStorage.removeItem('token');
                        localStorage.removeItem('userName');
                        window.location.href = '/public/index.html';
                    } else {
                        const data = await response.json();
                        alert("Erro ao excluir conta: " + (data.error || "Desconhecido"));
                    }
                } catch (error) {
                    console.error("Erro:", error);
                    alert("Erro de conexão ao tentar excluir a conta.");
                }
            }
        });
    }

    // Fechar modais ao clicar fora
    window.onclick = function(event) {
        if (settingsModal && event.target == settingsModal) {
            settingsModal.style.display = "none";
        }
        const mapModal = document.getElementById('map-modal');
        if (mapModal && event.target == mapModal) {
            mapModal.style.display = "none";
        }
    }

    // 5. Lógica do Modal do Mapa (Mantida para o futuro quando o histórico funcionar)
    const mapModal = document.getElementById('map-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const googleMapIframe = document.getElementById('google-map-iframe');
    const modalMapTitle = document.getElementById('modal-map-title');

    // Esta função precisa ser global ou acessível se for chamada de fora (ex: onclick no HTML gerado)
    // Mas como geramos o HTML via JS, podemos anexar o evento direto no elemento
    // (Veja a lógica comentada de loadHistory acima para referência)

    if (closeModalBtn && mapModal) {
        closeModalBtn.addEventListener('click', () => {
            mapModal.style.display = 'none';
            if(googleMapIframe) googleMapIframe.src = '';
        });
    }
});