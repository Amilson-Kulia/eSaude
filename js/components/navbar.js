class CustomNavbar extends HTMLElement {
    connectedCallback() {
        // 1. Verificar Sessão
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        
        let loginAreaHtml = '';

        if (usuarioLogado) {
            // Se estiver logado, pegamos o primeiro nome
            const primeiroNome = usuarioLogado.nome.split(' ')[0];
            
            // Criamos o botão de "Voltar" + Link do Nome para o Perfil
            loginAreaHtml = `
                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    <a href="dashboard.html" class="nav-back-btn" style="background: var(--primary-color); color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; text-decoration: none;">
                        <i data-feather="arrow-left" style="width: 14px; height: 14px; vertical-align: middle;"></i> Painel
                    </a>
                    <a href="profile.html" class="nav-user-link" title="Ir para meu perfil" style="color: var(--text-color); font-weight: bold; display: flex; align-items: center; gap: 5px;">
                        <i data-feather="user"></i> ${primeiroNome}
                    </a>
                </div>
            `;
        } else {
            // Se não estiver logado, apenas o botão de entrar
            loginAreaHtml = `<a href="login.html">Entrar</a>`;
        }

        this.innerHTML = `
            <style>


                nav {
    background-color: var(--white);
    box-shadow: var(--shadow);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
}
.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}
.logo { display: flex; align-items: center; text-decoration: none; }
.logo img { height: 40px; margin-right: 10px; }
.logo-text { font-size: 1.5rem; font-weight: bold; color: var(--primary-color); }

.nav-links { display: flex; gap: 2rem; align-items: center; }
.nav-links a { text-decoration: none; color: var(--text-color); font-weight: 500; transition: var(--transition); }
.nav-links a:hover { color: var(--primary-color); }

.nav-user-link { color: var(--primary-color) !important; font-weight: bold !important; display: flex; align-items: center; gap: 5px; }
.nav-user-link i { width: 18px; height: 18px; }

/* BOTÃO MOBILE - ESCONDIDO POR PADRÃO */
.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 1.5rem;
    cursor: pointer;
}
#aumentar{
   background-color: #096c8a;
}

#font-controls button {
    background: #f0f2f5; border: 1px solid #ddd; padding: 2px 8px; cursor: pointer; border-radius: 4px; margin: 0 2px;
}

/* TELAS PEQUENAS (MOBILE) */
@media (max-width: 768px) {
    .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        background-color: var(--white);
        padding: 1rem;
        box-shadow: var(--shadow);
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .mobile-menu-btn {
        display: block;
    }; }
}
            </style>
            
            <nav>
                <div class="navbar-container">
                    <a href="index.html" class="logo">
                        <img src="./img/icos/health_care_hands_doctor_heart_icon_233072.ico" alt="eSaúde Logo">
                        <span class="logo-text">eSaúde</span>
                    </a>
                    
                    <button class="mobile-menu-btn">
                        <i data-feather="menu"></i>
                    </button>
                    
                    <div class="nav-links">
                        <a href="index.html">Início</a>
                        <a href="sobre.html">Sobre</a>
                        <a href="dicas.html">Dicas de Saúde</a>
                        <a href="postos.html">Postos</a>
                        
                        ${loginAreaHtml}
                        
                        <div id="font-controls">
                            <button style="background-color: #096c8a; color: white; height: 30px;" onclick="changeSize(2)" title="Aumentar">A+</button>
                            <button style="background-color: #096c8a; color: white; width: 40px; height: 30px;" id="aumentar" onclick="changeSize(-2)" title="Diminuir">A-</button>
                            <button style="background-color: #096c8a; color: white; width: 40px; height: 30px;" id="aumentar" onclick="resetSize()" title="Resetar">R</button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        if(window.feather) feather.replace();

        const menuBtn = this.querySelector('.mobile-menu-btn');
        const navLinks = this.querySelector('.nav-links');
        if(menuBtn) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }
}

const root = document.documentElement;
const StorageKey = 'user-font-size';
let currentSize = parseInt(localStorage.getItem(StorageKey)) || 16;
applySize(currentSize);

function changeSize(delta){
    currentSize += delta;
    if(currentSize >= 10 && currentSize <= 40) applySize(currentSize);
}
function resetSize(){
    currentSize = 16;
    applySize(currentSize);
}
function applySize(size){
    root.style.setProperty('--base-font-size', size + 'px');
    localStorage.setItem(StorageKey, size);
}

customElements.define('custom-navbar', CustomNavbar);