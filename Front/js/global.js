// Global shared behaviors

// Populate header username across pages
export function tryPopulateHeaderUser() {
    const userNameElement = document.getElementById('userName');
    if (!userNameElement) return;
    const username = localStorage.getItem('sga_username') || 'Usuário';
    userNameElement.textContent = username;
}

// Setup user dropdown and logout/change user actions
export function initHeaderUserCommon() {
    tryPopulateHeaderUser();
    const userInfo = document.getElementById('userInfo');
    const userDropdown = document.getElementById('userDropdown');
    if (userInfo && userDropdown) {
        userInfo.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });
        document.addEventListener('click', function(e) {
            if (!userInfo.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    const changeUser = document.getElementById('changeUser');
    const logout = document.getElementById('logout');
    if (changeUser) {
        changeUser.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    }
    if (logout) {
        logout.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('sga_username');
            localStorage.removeItem('sga_login_time');
            localStorage.removeItem('sga_remember');
            redirectToLogin();
        });
    }
}

// Enable Relatórios dropdown by click
export function initReportsMenuClick() {
    const relItems = document.querySelectorAll('.nav-item.relatorios');
    relItems.forEach(item => {
        const link = item.querySelector('a.nav-link');
        if (!link) return;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            item.classList.toggle('open');
        });
    });
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.nav-item.relatorios.open').forEach(openItem => {
            if (!openItem.contains(e.target)) {
                openItem.classList.remove('open');
            }
        });
    });
}

// Simple redirect helper
export function redirectToLogin() { window.location.href = 'index.html'; }


