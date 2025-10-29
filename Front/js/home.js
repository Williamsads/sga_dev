// Home page logic
// - Load user, welcome animation, simple hover effects

import { initHeaderUserCommon } from './global.js';

document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('home.html')) return;
    initHeaderUserCommon();
    initHomePage();
    // no charts on home in this version
});

export function initHomePage() {
    const userNameElement = document.getElementById('userName');
    const userRoleElement = document.getElementById('userRole');
    const welcomeTitleElement = document.getElementById('welcomeTitle');

    loadUserData();
    addCardHoverEffects();
    addMenuHoverEffects();

    function loadUserData() {
        const username = localStorage.getItem('sga_username');
        if (username) {
            userNameElement.textContent = username;
            welcomeTitleElement.textContent = `Bem-vindo, ${username}`;
            const role = getUserRole(username);
            userRoleElement.textContent = role;
            animateWelcomeMessage();
        } else {
            window.location.href = 'index.html';
        }
    }

    function getUserRole(username) {
        const roles = { 'admin': 'Administrador', 'lucas': 'Usuário', 'usuario': 'Usuário', 'teste': 'Usuário' };
        return roles[username.toLowerCase()] || 'Usuário';
    }

    function animateWelcomeMessage() {
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeDivider = document.querySelector('.welcome-divider');
        const institutionalText = document.querySelector('.institutional-text');
        const accessButton = document.querySelector('.access-button');
        const infoCards = document.querySelectorAll('.info-card');
        setTimeout(() => { welcomeTitle.style.opacity = '1'; welcomeTitle.style.transform = 'translateY(0)'; }, 200);
        setTimeout(() => { welcomeDivider.style.width = '100px'; }, 400);
        setTimeout(() => { institutionalText.style.opacity = '1'; institutionalText.style.transform = 'translateY(0)'; }, 600);
        setTimeout(() => { accessButton.style.opacity = '1'; accessButton.style.transform = 'translateY(0)'; }, 800);
        infoCards.forEach((card, index) => {
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 1000 + (index * 200));
        });
        injectInitialAnimationStyles();
    }

    function addCardHoverEffects() {
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.addEventListener('mouseenter', function() { this.style.borderTopColor = getRandomColor(); });
            card.addEventListener('mouseleave', function() { this.style.borderTopColor = '#0033A0'; });
        });
    }

    function addMenuHoverEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() { this.style.boxShadow = '0 0 20px rgba(0, 51, 160, 0.3)'; });
            link.addEventListener('mouseleave', function() { this.style.boxShadow = 'none'; });
        });
    }

    function getRandomColor() { const colors = ['#0033A0', '#FFD100', '#EF3340', '#009739']; return colors[Math.floor(Math.random() * colors.length)]; }

    function injectInitialAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .welcome-title { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
            .welcome-divider { width: 0; transition: width 0.8s ease; }
            .institutional-text { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
            .access-button { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
            .info-card { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
        `;
        document.head.appendChild(style);
    }
}


