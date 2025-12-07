document.addEventListener('DOMContentLoaded', () => {
    // --- AUTH CHECK ---
    const token = localStorage.getItem('token');
    // Lista de páginas que NÃO precisam de auth (se houver alguma dentro de /pages que seja pública, adicione aqui)
    // Por padrão, assumimos que tudo em /pages precisa de login, exceto login.html e cadastro.html que estão fora ou tratados

    // Verifica se não estamos na página de login ou cadastro para evitar loop
    const isPublicPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('cadastro.html');

    if (!token && !isPublicPage) {
        // Redireciona para o login se não tiver token
        // Ajuste o caminho conforme a estrutura de pastas. 
        // Se estiver em /public/pages/..., voltar para /public/index.html ou /public/pages/login.html
        window.location.href = '/public/index.html';
        return;
    }

    // --- USER GREETING ---
    const userName = localStorage.getItem('userName');
    if (userName) {
        const greetingElement = document.getElementById('user-greeting');
        if (greetingElement) {
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
            greetingElement.textContent = `Olá, ${formattedName}!`;
        }
    }

    // --- MENU DROPDOWN ---
    const profileTrigger = document.getElementById('profile-menu-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (profileDropdown.classList.contains('show')) {
                if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                    profileDropdown.classList.remove('show');
                }
            }
        });
    }

    // --- LOGOUT ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/public/index.html';
        });
    }
});
