document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            // 1. Capturar os dados digitados e remover espaços extras
            const emailOrPhone = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // 2. Feedback visual no botão
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Verificando...';

            // 3. Buscar a lista de usuários no LocalStorage
            const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];

            // DEBUG: Remover após testar (ajuda a ver o que tem no "banco" pelo console F12)
            console.log("Usuários cadastrados no sistema:", usuariosCadastrados);

            // 4. Procurar o usuário
            const usuarioEncontrado = usuariosCadastrados.find(user => 
                (user.email === emailOrPhone || user.telefone === emailOrPhone) && 
                user.password === password
            );

            // 5. Simular um pequeno atraso para parecer processamento real
            setTimeout(() => {
                if (usuarioEncontrado) {
                    // Criar a "Sessão" do usuário logado
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
                    
                    alert('Login realizado com sucesso! Bem-vindo ao eSaúde Angola.');
                    
                    // Redireciona para o Dashboard (conforme seu HTML)
                    window.location.href = 'dashboard.html'; 
                } else {
                    alert('Erro: E-mail/Telefone ou senha incorretos.');
                    
                    // Resetar botão em caso de erro
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }, 800);
        });
    }

    // Lógica do botão SMS
    const btnSms = document.querySelector('.btn-sms');
    if(btnSms) {
        btnSms.addEventListener('click', () => {
            alert('Um código de verificação foi enviado para o seu telefone cadastrado.');
        });
    }
});