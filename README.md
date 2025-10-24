# 🧩 Sistema SGA - Ambiente de Desenvolvimento

Este repositório contém o **SGA (Sistema de Gestão Administrativa)** em ambiente de desenvolvimento.  
O objetivo é centralizar o código-fonte, dependências e instruções para configuração local e deploy.

---

## ⚙️ Tecnologias Utilizadas
- **Frontend:** React.js / HTML / CSS / JavaScript  
- **Backend:** Flask (Python)  
- **Banco de Dados:** PostgreSQL  
- **Controle de Versão:** Git + GitHub  
- **Servidor Local:** Flask / Node.js  
- **IDE Recomendada:** VS Code  

---

## 🏗️ Estrutura do Projeto
```/sga
├── app/
│ ├── init.py
│ └── (outros arquivos Python, ex: models.py, controllers.py)
│
├── routes/
│ ├── init.py
│ └── (arquivos de rotas, ex: main.py, auth.py)
│
├── static/
│ ├── css/
│ │ └── estilos.css
│ ├── img/
│ │ └── logo.png
│ ├── js/
│ │ └── scripts.js
│
├── templates/
│ └── (arquivos HTML, ex: base.html, index.html, login.html)
│
└── run.py # arquivo principal para iniciar o servidor Flask
```

---

## 🧪 Ambiente de Teste / Homologação
- Servidor espelhando o ambiente de produção  
- Banco de dados de teste ()    

---

## 🚀 Ambiente de Produção
- **Servidor:** VM dedicada (porta /)  
- **Certificado SSL:** HTTPS habilitado  
- **Banco de Dados:** PostgreSQL  
- **Deploy:** GitHub Actions / Script manual  
- **Backup:** Automático diário  

---

## 👨‍💻 Equipe de Desenvolvimento
- **Desenvolvedor Responsável:** Williams, lucas 
- **Suporte Técnico:** 
- **Status do Projeto:** 🧱 Em Desenvolvimento  

---

## 🧾 Licença
Este projeto é de uso interno e **não deve ser redistribuído** sem autorização prévia.

