// Index (login) page logic
// - Validates credentials and redirects to home.html
// - Password toggle and forgot-password modal

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const errorMessage = document.getElementById('errorMessage');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const modalClose = document.getElementById('modalClose');
    const cancelRecovery = document.getElementById('cancelRecovery');
    const sendRecovery = document.getElementById('sendRecovery');
    const recoveryLogin = document.getElementById('recoveryLogin');
    const loginButton = document.querySelector('.login-button');

    if (!loginForm) return;

    let isPasswordVisible = false;
    checkRememberedUser();

    loginForm.addEventListener('submit', handleLogin);
    passwordToggle.addEventListener('click', togglePasswordVisibility);
    usernameField.addEventListener('input', clearError);
    passwordField.addEventListener('input', clearError);
    forgotPasswordLink.addEventListener('click', openForgotPasswordModal);
    modalClose.addEventListener('click', closeForgotPasswordModal);
    cancelRecovery.addEventListener('click', closeForgotPasswordModal);
    sendRecovery.addEventListener('click', handlePasswordRecovery);
    forgotPasswordModal.addEventListener('click', function(e) { if (e.target === forgotPasswordModal) closeForgotPasswordModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && forgotPasswordModal.classList.contains('show')) closeForgotPasswordModal(); });

    function handleLogin(e) {
        e.preventDefault();
        const username = usernameField.value.trim();
        const password = passwordField.value.trim();
        if (!username || !password) { showError('Por favor, preencha todos os campos obrigatórios.'); return; }
        if (validateCredentials(username, password)) {
            saveUserData(username);
            showLoading();
            setTimeout(() => { window.location.href = 'home.html'; }, 1000);
        } else {
            showError('Login ou senha incorretos. Verifique suas credenciais.');
        }
    }

    function validateCredentials(username, password) {
        const validUsers = { 'admin': 'admin123', 'lucas': 'lucas123', 'usuario': 'senha123', 'teste': 'teste123' };
        return validUsers[username.toLowerCase()] === password;
    }

    function saveUserData(username) {
        localStorage.setItem('sga_username', username);
        localStorage.setItem('sga_login_time', new Date().toISOString());
        const rememberMe = document.getElementById('rememberMe').checked;
        if (rememberMe) localStorage.setItem('sga_remember', 'true'); else localStorage.removeItem('sga_remember');
    }

    function togglePasswordVisibility() {
        isPasswordVisible = !isPasswordVisible;
        if (isPasswordVisible) { passwordField.type = 'text'; passwordToggle.innerHTML = '<span class="eye-icon">👁️‍🗨️</span>'; }
        else { passwordField.type = 'password'; passwordToggle.innerHTML = '<span class="eye-icon">👁️</span>'; }
    }

    function showError(message) { errorMessage.textContent = message; errorMessage.classList.add('show'); setTimeout(() => { clearError(); }, 5000); }
    function clearError() { errorMessage.classList.remove('show'); }
    function showLoading() { loginButton.classList.add('loading'); loginButton.disabled = true; }
    function checkRememberedUser() { const remembered = localStorage.getItem('sga_remember'); const username = localStorage.getItem('sga_username'); if (remembered==='true' && username) { usernameField.value = username; document.getElementById('rememberMe').checked = true; } }

    function openForgotPasswordModal(e) { e.preventDefault(); forgotPasswordModal.classList.add('show'); recoveryLogin.focus(); }
    function closeForgotPasswordModal() { forgotPasswordModal.classList.remove('show'); recoveryLogin.value = ''; }
    function handlePasswordRecovery() { const login = recoveryLogin.value.trim(); if (!login) { alert('Por favor, digite seu login.'); return; } showRecoveryMessage(login); }
    function showRecoveryMessage(login) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">📧</div>
                <h4 style="color: #0033A0; margin-bottom: 10px;">Email Enviado!</h4>
                <p style="color: #666; margin-bottom: 20px;">Instruções para redefinir sua senha foram enviadas para o email associado ao login <strong>${login}</strong>.</p>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">Verifique sua caixa de entrada e spam. O link expira em 24 horas.</p>
                <button id="modalOkBtn" class="btn-primary">Entendi</button>
            </div>`;
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        modalBody.appendChild(messageDiv);
        const ok = document.getElementById('modalOkBtn');
        ok.addEventListener('click', closeForgotPasswordModal);
    }
});


