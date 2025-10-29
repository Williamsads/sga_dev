// Agendamento page logic
// - Form validation, masks, and field states
// - Protocol generation and persistence
// - Wait time computation

import { tryPopulateHeaderUser, initHeaderUserCommon, initReportsMenuClick } from './global.js';

document.addEventListener('DOMContentLoaded', function() {
    const scheduleForm = document.getElementById('scheduleForm');
    if (!scheduleForm) return;

    initHeaderUserCommon();
    initReportsMenuClick();
    initSchedulePage();

    scheduleForm.addEventListener('submit', handleScheduleSubmit);
    const startDateField = document.getElementById('startDate');
    const startTimeField = document.getElementById('startTime');
    const endTimeField = document.getElementById('endTime');
    const priorityField = document.getElementById('priority');
    const cpfField = document.getElementById('cpf');
    const registrationField = document.getElementById('registration');
    const emailField = document.getElementById('email');
    const clearFormBtn = document.getElementById('clearForm');

    if (startDateField) startDateField.addEventListener('change', updateWaitTime);
    if (startTimeField) startTimeField.addEventListener('change', updateWaitTime);
    if (endTimeField) endTimeField.addEventListener('change', validateEndTime);
    if (priorityField) priorityField.addEventListener('change', handlePriorityChange);
    if (cpfField) cpfField.addEventListener('input', handleCpfMaskAndValidate);
    if (registrationField) registrationField.addEventListener('input', allowOnlyDigits);
    if (emailField) emailField.addEventListener('input', validateEmailField);
    if (clearFormBtn) clearFormBtn.addEventListener('click', function(){ scheduleForm.reset(); initSchedulePage(); });
});

export function initSchedulePage() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const startDate = document.getElementById('startDate');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    if (startDate && !startDate.value) startDate.value = dateStr;
    if (startTime && !startTime.value) startTime.value = '';
    if (endTime && !endTime.value) endTime.value = '';
    generateAndSetProtocol();
    updateWaitTime();
}

// Generate unique daily protocol like SAS-YYYYMMDD-XXX
export function generateAndSetProtocol() {
    const protocolEl = document.getElementById('protocol');
    if (!protocolEl) return;
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const key = `sas_protocol_counter_${y}${m}${d}`;
    const next = (parseInt(localStorage.getItem(key) || '0', 10) + 1);
    localStorage.setItem(key, String(next));
    const code = `SAS-${y}${m}${d}-${String(next).padStart(3, '0')}`;
    protocolEl.value = code;
}

// Compute wait time between now and selected datetime
export function updateWaitTime() {
    const waitField = document.getElementById('waitTime');
    const dateEl = document.getElementById('startDate');
    const timeEl = document.getElementById('startTime');
    if (!waitField || !dateEl || !timeEl || !dateEl.value || !timeEl.value) return;
    const selected = new Date(`${dateEl.value}T${timeEl.value}:00`);
    const now = new Date();
    let diffMs = selected.getTime() - now.getTime();
    const sign = diffMs < 0 ? '-' : '';
    diffMs = Math.abs(diffMs);
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    waitField.value = `${sign}${String(hours).padStart(2, '0')}h${String(rem).padStart(2, '0')}m`;
}

export function validateEndTime() {
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    if (!startTime || !endTime || !startTime.value || !endTime.value) return;
    if (endTime.value <= startTime.value) {
        endTime.value = addMinutesToTime(startTime.value, 30);
    }
}

export function handlePriorityChange() {
    const priority = document.getElementById('priority');
    const row = document.getElementById('justificationRow');
    if (!priority || !row) return;
    row.style.display = priority.value === 'Urgente' ? 'grid' : 'none';
}

// Mask and validate CPF
export function handleCpfMaskAndValidate(e) {
    const input = e.target;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    let masked = '';
    if (digits.length > 0) masked = digits.slice(0, 3);
    if (digits.length > 3) masked += '.' + digits.slice(3, 6);
    if (digits.length > 6) masked += '.' + digits.slice(6, 9);
    if (digits.length > 9) masked += '-' + digits.slice(9, 11);
    input.value = masked;
    const isValid = validateCPF(digits);
    setFieldValidState(input, isValid, isValid ? '' : 'CPF inválido.');
}

// Allow only digits
export function allowOnlyDigits(e) { e.target.value = e.target.value.replace(/\D/g, ''); }

// Validate email format
export function validateEmailField(e) {
    const input = e.target;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = regex.test(input.value.trim());
    setFieldValidState(input, ok, ok ? '' : 'E-mail inválido.');
}

// Mark field/group as valid/invalid
export function setFieldValidState(input, valid, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    const small = group.querySelector('.error-text');
    if (valid) { group.classList.remove('invalid'); if (small) small.textContent = ''; }
    else { group.classList.add('invalid'); if (small) small.textContent = message || 'Campo inválido'; }
}

// Submit handler with required fields
export function handleScheduleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const requiredSelectors = ['#fullName','#serviceType'];
    let ok = true;
    requiredSelectors.forEach(sel => {
        const el = form.querySelector(sel);
        if (!el) return;
        const valid = Boolean(el.value && el.value.trim() !== '');
        setFieldValidState(el, valid, 'Campo obrigatório.');
        if (!valid) ok = false;
    });
    const cpfEl = document.getElementById('cpf');
    if (cpfEl && cpfEl.value) handleCpfMaskAndValidate({ target: cpfEl });
    if (!ok) { alert('Por favor, preencha os campos obrigatórios antes de continuar.'); return; }
    alert('Agendamento realizado com sucesso!');
    persistSchedule(form);
    const protocol = document.getElementById('protocol')?.value;
    if (protocol) {
        const list = JSON.parse(localStorage.getItem('sas_protocol_history') || '[]');
        list.push({ protocol, createdAt: new Date().toISOString() });
        localStorage.setItem('sas_protocol_history', JSON.stringify(list));
    }
    form.reset();
    initSchedulePage();
}

// Validate CPF digits
export function validateCPF(digits) {
    if (!digits || digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    const calc = (base) => { let sum = 0; for (let i = 0; i < base; i++) { sum += parseInt(digits[i], 10) * (base + 1 - i); } const mod = sum % 11; return (mod < 2) ? 0 : 11 - mod; };
    const d1 = calc(9); const d2 = calc(10);
    return d1 === parseInt(digits[9], 10) && d2 === parseInt(digits[10], 10);
}

export function addMinutesToTime(timeHHmm, minutesToAdd) {
    const [h, m] = timeHHmm.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

// Persist schedule into localStorage
export function persistSchedule(form) {
    const data = {
        fullName: form.querySelector('#fullName')?.value || '',
        cpf: form.querySelector('#cpf')?.value || '',
        serviceType: form.querySelector('#serviceType')?.value || '',
        bondType: form.querySelector('#bondType')?.value || '',
        attendanceType: form.querySelector('#attendanceType')?.value || '',
        startDate: form.querySelector('#startDate')?.value || '',
        startTime: form.querySelector('#startTime')?.value || '',
        endTime: form.querySelector('#endTime')?.value || '',
        waitTime: form.querySelector('#waitTime')?.value || '',
        protocol: form.querySelector('#protocol')?.value || ''
    };
    const key = 'sas_schedules';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(data);
    localStorage.setItem(key, JSON.stringify(list));
}


