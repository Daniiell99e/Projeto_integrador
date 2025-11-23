document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Verifica Token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/public/index.html'; // Redireciona se não estiver logado
        return;
    }

    // 2. Configuração da API
    const API_URL = 'http://localhost:3333/user/profile';

    // 3. Mapeamento: [Nome no HTML (data-field)] : [Nome no Banco de Dados]
    const fieldMapping = {
        'nome': 'name',            // BD: name -> HTML: nome (Nome Completo)
        // 'user_name' não está no form, mas existe no banco
        'email': 'email',          // BD: email
        'telefone': 'telefone',    // BD: telefone
        'cidade': 'cidade',        // BD: cidade
        'pais': 'pais',            // BD: pais
        'bio': 'biografia',        // BD: biografia -> HTML: bio
        'nascimento': 'data_nascimento', // BD: data_nascimento -> HTML: nascimento
        'instagram': 'rede_social' // BD: rede_social -> HTML: instagram
    };

    // --- LÓGICA DE CARREGAMENTO ---
    async function fetchAndLoadProfile() {
        try {
            const response = await fetch(API_URL, {
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
            
            // Preenche a tela com os dados reais
            loadProfileInfo(userData);

            // Por enquanto, o histórico continua vazio ou mockado 
            // (futuramente buscaremos de '/user/roteiros')
            loadHistory([]); 

        } catch (error) {
            console.error("Falha:", error);
            document.getElementById('user-profile-name').textContent = "Usuário";
            // Se o token for inválido, pode deslogar:
            // localStorage.removeItem('token');
            // window.location.href = '/public/index.html';
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
        // (Aqui entraria o loop forEach igual ao anterior se tivéssemos dados)
    }

    // Inicializa
    fetchAndLoadProfile();

    // --- LÓGICA DE INTERFACE (Abas, Edição, Modal, etc.) ---
    // (Copiado do código anterior, mantendo funcionalidade)
    
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
            // Por enquanto apenas fecha visualmente, 
            // no próximo passo faremos o PUT para salvar no banco!
            
            // Atualiza visualmente os <p> com o que está no <input>
            profileForm.querySelectorAll('.edit-mode').forEach(input => {
                const fieldName = input.dataset.field;
                const p = profileForm.querySelector(`.view-mode[data-field="${fieldName}"]`);
                if(p) p.textContent = input.value; // (Simplificado para visualização)
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
                reader.onload = (ev) => { profilePicImg.src = ev.target.result; };
                reader.readAsDataURL(file);
            }
        });
    }
});