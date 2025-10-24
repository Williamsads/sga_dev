const senhaInput = document.getElementById('senha');
const toggleBtn = document.getElementById('toggleSenha');
const eyeIcon = toggleBtn.querySelector('i');

toggleBtn.addEventListener('click', () => {
  const isHidden = senhaInput.type === 'password';
  senhaInput.type = isHidden ? 'text' : 'password';
  eyeIcon.classList.toggle('bi-eye');
  eyeIcon.classList.toggle('bi-eye-slash');
});
