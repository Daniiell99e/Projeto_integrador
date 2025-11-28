/**
 * ========================================
 * ROTEIRO DIÁRIO - JAVASCRIPT
 * Sistema de gerenciamento de roteiros de viagem
 * ========================================
 */

// ========================================
// ESTADO DA APLICAÇÃO
// ========================================

let activities = [
    {
        time: "09:00",
        duration: "2h",
        title: "Torre Eiffel",
        description: "Visita ao monumento mais famoso de Paris",
        category: "Monumentos",
        price: "€29 por pessoa"
    },
    {
        time: "13:00",
        duration: "2h",
        title: "Museu do Louvre",
        description: "Exploração das obras de arte mais famosas do mundo",
        category: "Museus",
        price: "€17 por pessoa"
    },
    {
        time: "18:00",
        duration: "3h",
        title: "Cruzeiro no Sena",
        description: "Jantar romântico com vista para os monumentos iluminados",
        category: "Entretenimento",
        price: "€85 por pessoa"
    }
];

let editingIndex = null;
let isEditMode = false;

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderActivities();
    attachEventListeners();
    updateDailySummary();
}

// ========================================
// EVENT LISTENERS
// ========================================

function attachEventListeners() {
    // Day Tabs
    const dayTabs = document.querySelectorAll('.day-tab');
    dayTabs.forEach(tab => {
        tab.addEventListener('click', handleDayChange);
    });

    // Add Activity Button
    const addBtn = document.getElementById('addActivityBtn');
    addBtn.addEventListener('click', handleAddActivity);

    // Modal Controls
    const modal = document.getElementById('activityModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const backdrop = document.getElementById('modalBackdrop');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Form Submit
    const form = document.getElementById('activityForm');
    form.addEventListener('submit', handleFormSubmit);

    // Export Dropdown
    const exportBtn = document.getElementById('exportBtn');
    const exportMenu = document.getElementById('exportMenu');
    
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportMenu.classList.toggle('show');
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!exportMenu.contains(e.target) && e.target !== exportBtn) {
            exportMenu.classList.remove('show');
        }
    });

    // Export Actions
    const exportItems = document.querySelectorAll('.dropdown-item');
    exportItems.forEach(item => {
        item.addEventListener('click', handleExport);
    });
}

// ========================================
// RENDERIZAÇÃO DE ATIVIDADES
// ========================================

function renderActivities() {
    const container = document.getElementById('activitiesList');
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <p>Nenhuma atividade adicionada ainda.</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Clique em "Adicionar Atividade" para começar.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activities.map((activity, index) => `
        <div class="activity-card">
            <div class="activity-header">
                <div class="activity-time-info">
                    <div class="activity-time">${activity.time}</div>
                    <div class="activity-duration">${activity.duration}</div>
                </div>
                <div class="activity-actions">
                    <button class="action-btn" onclick="moveActivityUp(${index})" aria-label="Mover para cima" ${index === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="moveActivityDown(${index})" aria-label="Mover para baixo" ${index === activities.length - 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="editActivity(${index})" aria-label="Editar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteActivity(${index})" aria-label="Excluir">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="activity-body">
                <h4 class="activity-title">${escapeHtml(activity.title)}</h4>
                <p class="activity-description">${escapeHtml(activity.description)}</p>
            </div>
            <div class="activity-footer">
                <span class="activity-category">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    ${activity.category}
                </span>
                <span class="activity-price">${activity.price}</span>
            </div>
        </div>
    `).join('');
}

// ========================================
// GERENCIAMENTO DE ATIVIDADES
// ========================================

function handleAddActivity() {
    isEditMode = false;
    editingIndex = null;
    
    document.getElementById('modalTitle').textContent = 'Adicionar Atividade';
    document.getElementById('modalDescription').textContent = 'Preencha os campos abaixo para adicionar uma nova atividade ao roteiro.';
    document.getElementById('submitBtn').textContent = 'Adicionar';
    
    // Limpar formulário
    document.getElementById('activityForm').reset();
    clearErrors();
    
    openModal();
}

function editActivity(index) {
    isEditMode = true;
    editingIndex = index;
    
    const activity = activities[index];
    
    document.getElementById('modalTitle').textContent = 'Editar Atividade';
    document.getElementById('modalDescription').textContent = 'Preencha os campos abaixo para editar a atividade ao roteiro.';
    document.getElementById('submitBtn').textContent = 'Salvar';
    
    // Preencher formulário
    document.getElementById('activityTitle').value = activity.title;
    document.getElementById('activityDescription').value = activity.description;
    document.getElementById('activityTime').value = activity.time;
    document.getElementById('activityDuration').value = activity.duration;
    document.getElementById('activityCategory').value = activity.category;
    document.getElementById('activityPrice').value = activity.price;
    
    clearErrors();
    openModal();
}

function deleteActivity(index) {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
        const activity = activities[index];
        activities.splice(index, 1);
        renderActivities();
        updateDailySummary();
        showToast(`"${activity.title}" foi excluída`, 'error');
    }
}

function moveActivityUp(index) {
    if (index > 0) {
        [activities[index - 1], activities[index]] = [activities[index], activities[index - 1]];
        renderActivities();
        showToast('Atividade movida para cima', 'info');
    }
}

function moveActivityDown(index) {
    if (index < activities.length - 1) {
        [activities[index], activities[index + 1]] = [activities[index + 1], activities[index]];
        renderActivities();
        showToast('Atividade movida para baixo', 'info');
    }
}

// ========================================
// FORMULÁRIO
// ========================================

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Limpar erros anteriores
    clearErrors();
    
    // Coletar dados do formulário
    const formData = {
        title: document.getElementById('activityTitle').value.trim(),
        description: document.getElementById('activityDescription').value.trim(),
        time: document.getElementById('activityTime').value,
        duration: document.getElementById('activityDuration').value.trim(),
        category: document.getElementById('activityCategory').value,
        price: document.getElementById('activityPrice').value.trim()
    };
    
    // Validar
    if (!validateForm(formData)) {
        return;
    }
    
    // Adicionar ou editar
    if (isEditMode) {
        activities[editingIndex] = formData;
        showToast('Atividade atualizada com sucesso!', 'success');
    } else {
        activities.push(formData);
        showToast('Atividade adicionada com sucesso!', 'success');
    }
    
    // Atualizar UI
    renderActivities();
    updateDailySummary();
    closeModal();
}

function validateForm(data) {
    let isValid = true;
    
    // Validar título
    if (!data.title || data.title.length > 100) {
        showError('titleError', 'Título é obrigatório e deve ter no máximo 100 caracteres');
        isValid = false;
    }
    
    // Validar descrição
    if (!data.description || data.description.length > 500) {
        showError('descriptionError', 'Descrição é obrigatória e deve ter no máximo 500 caracteres');
        isValid = false;
    }
    
    // Validar horário
    if (!data.time) {
        showError('timeError', 'Horário é obrigatório');
        isValid = false;
    }
    
    // Validar duração
    if (!data.duration) {
        showError('durationError', 'Duração é obrigatória');
        isValid = false;
    }
    
    // Validar categoria
    if (!data.category) {
        showError('categoryError', 'Categoria é obrigatória');
        isValid = false;
    }
    
    // Validar preço
    if (!data.price) {
        showError('priceError', 'Preço é obrigatório');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearErrors() {
    const errors = document.querySelectorAll('.form-error');
    errors.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
}

// ========================================
// MODAL
// ========================================

function openModal() {
    const modal = document.getElementById('activityModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('activityModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Limpar formulário
    document.getElementById('activityForm').reset();
    clearErrors();
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('activityModal');
        if (modal.classList.contains('show')) {
            closeModal();
        }
    }
});

// ========================================
// DAY TABS
// ========================================

function handleDayChange(e) {
    const dayTabs = document.querySelectorAll('.day-tab');
    dayTabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    
    const day = e.target.dataset.day;
    showToast(`Visualizando Dia ${day}`, 'info');
}

// ========================================
// EXPORTAÇÃO
// ========================================

function handleExport(e) {
    const action = e.currentTarget.dataset.action;
    const menu = document.getElementById('exportMenu');
    menu.classList.remove('show');
    
    switch(action) {
        case 'pdf':
            exportToPDF();
            break;
        case 'excel':
            exportToExcel();
            break;
        case 'print':
            window.print();
            break;
    }
}

function exportToPDF() {
    showToast('Exportando para PDF...', 'info');
    // Aqui você implementaria a lógica real de exportação
    setTimeout(() => {
        showToast('PDF exportado com sucesso!', 'success');
    }, 1500);
}

function exportToExcel() {
    showToast('Exportando para Excel...', 'info');
    // Aqui você implementaria a lógica real de exportação
    setTimeout(() => {
        showToast('Excel exportado com sucesso!', 'success');
    }, 1500);
}

// ========================================
// RESUMO DIÁRIO
// ========================================

function updateDailySummary() {
    // Calcular estatísticas
    const totalActivities = activities.length;
    const totalHours = calculateTotalHours();
    const totalCost = calculateTotalCost();
    
    // Atualizar UI
    document.getElementById('dailyActivities').textContent = 
        totalActivities === 1 ? '1 ponto turístico' : `${totalActivities} pontos turísticos`;
    
    document.getElementById('dailyDuration').textContent = totalHours;
    document.getElementById('dailyCost').textContent = totalCost;
}

function calculateTotalHours() {
    let totalMinutes = 0;
    
    activities.forEach(activity => {
        const duration = activity.duration.toLowerCase();
        const hours = duration.match(/(\d+)h/);
        const minutes = duration.match(/(\d+)m/);
        
        if (hours) totalMinutes += parseInt(hours[1]) * 60;
        if (minutes) totalMinutes += parseInt(minutes[1]);
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
        return hours === 1 ? '1 hora' : `${hours} horas`;
    }
    
    return `${hours}h${minutes}min`;
}

function calculateTotalCost() {
    let total = 0;
    
    activities.forEach(activity => {
        const priceMatch = activity.price.match(/€(\d+)/);
        if (priceMatch) {
            total += parseInt(priceMatch[1]);
        }
    });
    
    const perPerson = (total / 2).toFixed(2);
    return `€${total} (€${perPerson}/pessoa)`;
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        ${icon}
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    
    container.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `,
        error: `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        `,
        info: `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `
    };
    
    return icons[type] || icons.info;
}

// ========================================
// UTILITÁRIOS
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// RESPONSIVIDADE MOBILE
// ========================================

// Detectar clique fora de elementos
function handleClickOutside(element, callback) {
    document.addEventListener('click', (e) => {
        if (!element.contains(e.target)) {
            callback();
        }
    });
}

// Smooth scroll para elementos
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// EXPORTAÇÃO DE FUNÇÕES GLOBAIS
// ========================================

// Funções que precisam ser acessadas via onclick no HTML
window.moveActivityUp = moveActivityUp;
window.moveActivityDown = moveActivityDown;
window.editActivity = editActivity;
window.deleteActivity = deleteActivity;
