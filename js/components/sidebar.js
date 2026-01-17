class CustomSidebar extends HTMLElement {
    connectedCallback() {
        // 1. Buscar os dados do usuário logado no LocalStorage
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || {
            nome: 'Usuário',
            email: 'usuario@email.com'
        };

        // 2. Gerar as iniciais do nome
        const nomes = usuarioLogado.nome.split(' ');
        const iniciais = nomes.length > 1 
            ? (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase() 
            : nomes[0][0].toUpperCase();

        this.innerHTML = `
            <style>
                /* Botão que aparece apenas no Mobile */
                .sidebar-toggle-btn {
                    display: none;
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: var(--primary-color, #096c8a);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    z-index: 2100;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                }

                .sidebar {
                    width: 250px;
                    background-color: var(--sidebar-bg, #2c3e50);
                    color: var(--sidebar-text, #ecf0f1);
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    transition: var(--transition, all 0.3s ease);
                    z-index: 2000;
                }

                .sidebar-header { padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                .sidebar-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
                .sidebar-logo img { height: 30px; }
                .sidebar-logo span { font-weight: bold; color: var(--sidebar-text); }
                
                .sidebar-menu { padding: 1rem 0; height: calc(100vh - 180px); overflow-y: auto; }
                .menu-item { display: flex; align-items: center; padding: 0.8rem 1.5rem; color: var(--sidebar-text); text-decoration: none; transition: var(--transition); }
                .menu-item:hover { background-color: rgba(255, 255, 255, 0.1); }
                .menu-item.active { background-color: var(--sidebar-active, #3498db); }
                .menu-item i { margin-right: 0.8rem; width: 20px; height: 20px; }
                
                .sidebar-footer { position: absolute; bottom: 0; width: 100%; padding: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--sidebar-bg); }
                .user-profile { display: flex; align-items: center; gap: 0.5rem; }
                .user-avatar { width: 40px; height: 40px; border-radius: 50%; background-color: var(--sidebar-active, #3498db); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0; }
                .user-info { flex: 1; overflow: hidden; }
                .user-name { font-size: 0.85rem; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                .user-email { font-size: 0.7rem; opacity: 0.7; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                .logout-btn { background: none; border: none; color: var(--sidebar-text); cursor: pointer; padding: 5px; transition: 0.2s; }
                .logout-btn:hover { color: #ff7675; }

                /* Overlay para fechar o menu ao clicar fora no mobile */
                .sidebar-overlay {
                    display: none;
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 1999;
                }

                .sidebar-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background-color: var(--sidebar-bg); /* Garante que o fundo combine */
    box-sizing: border-box; /* ESSENCIAL: Faz o padding ser contado dentro dos 100% */
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden; /* Evita que o texto longo empurre o botão de sair */
}

.user-info {
    flex: 1;
    min-width: 0; /* Permite que o texto encolha e use reticências se necessário */
}

.user-name, .user-email {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Adiciona "..." se o nome for muito grande */
}

                /* MEDIA QUERY PARA TELAS PEQUENAS */
                @media (max-width: 768px) {
                    .sidebar-toggle-btn { display: flex; }
                    
                    .sidebar {
                        position: fixed;
                        left: -250px; /* Escondido */
                        top: 0;
                    }

                    .sidebar.open {
                        left: 0; /* Mostra o menu */
                        box-shadow: 5px 0 15px rgba(0,0,0,0.3);
                    }

                    .sidebar-overlay.active { display: block; }
                }
            </style>

            <button class="sidebar-toggle-btn" id="mobileToggle">
                <i data-feather="menu"></i>
            </button>

            <div class="sidebar-overlay" id="sidebarOverlay"></div>

            <div class="sidebar" id="sidebarElement">
                <div class="sidebar-header">
                    <a href="dashboard.html" class="sidebar-logo">
                        <img src="./img/icos/health_care_hands_doctor_heart_icon_233072.ico" alt="eSaúde Logo">
                        <span>eSaúde</span>
                    </a>
                </div>
                
                <div class="sidebar-menu">
                    <a href="dashboard.html" class="menu-item active">
                        <i data-feather="home"></i>
                        <span>Painel</span>
                    </a>
                    <a href="#consultas" class="menu-item">
                        <i data-feather="calendar"></i>
                        <span>Consultas</span>
                    </a>
                    <a href="./dashboard.html" class="menu-item">
                        <i data-feather="file-text"></i>
                        <span>Histórico</span>
                    </a>
                    <a href="postos.html" class="menu-item">
                        <i data-feather="map-pin"></i>
                        <span>Postos</span>
                    </a> 
                    <a href="profile.html" class="menu-item">
                        <i data-feather="user"></i>
                        <span>Perfil</span>
                    </a>
                </div>
                
                <div class="sidebar-footer">
                    <div class="user-profile">
                        <div class="user-avatar">${iniciais}</div>
                        <div class="user-info">
                            <div class="user-name">${usuarioLogado.nome}</div>
                            <div class="user-email">${usuarioLogado.email}</div>
                        </div>
                        <button class="logout-btn" title="Sair">
                            <i data-feather="log-out"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.initSidebarLogic();
    }

    initSidebarLogic() {
        if (window.feather) feather.replace();

        const sidebar = this.querySelector('#sidebarElement');
        const toggleBtn = this.querySelector('#mobileToggle');
        const overlay = this.querySelector('#sidebarOverlay');
        const menuItems = this.querySelectorAll('.menu-item');

        // Lógica para abrir/fechar no mobile
        const toggleMenu = () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
            
            // Troca o ícone de menu para fechar (X)
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.setAttribute('data-feather', 'x');
            } else {
                icon.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        };

        toggleBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Lógica de menu ativo e fechar ao clicar (mobile)
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                if (window.innerWidth <= 768) toggleMenu();
            });
        });
        
        // Lógica de Logout
        const logoutBtn = this.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja encerrar a sessão?')) {
                    localStorage.removeItem('usuarioLogado');
                    window.location.href = 'login.html';
                }
            });
        }
    }
}

customElements.define('custom-sidebar', CustomSidebar);