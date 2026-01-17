document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    // --- 1. REGRAS DE VALIDAÇÃO ---
    const regras = {
        bi: (val) => /^\d{9}[A-Z]{2}\d{3}$/.test(val.trim().toUpperCase()),
        senha: (val) => /^(?=.*[A-Z])(?=.*[!@#$%^&*.,?])[a-zA-Z\d!@#$%^&*.,?]{6,}$/.test(val),
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        telefone: (val) => /^9\d{8}$/.test(val.trim()) // Valida padrão Angola (começa com 9, total 9 dígitos)
    };

    // --- 2. FUNÇÃO DE INTERFACE (EXIBIR ERROS) ---
    function gerenciarMensagemErro(input, mensagem, exibir) {
        if (!input) return;
        let erroSpan = input.parentNode.querySelector('.error-msg-realtime');
        
        if (!erroSpan) {
            erroSpan = document.createElement('span');
            erroSpan.className = 'error-msg-realtime';
            erroSpan.style.cssText = 'color: #ff4d4d; font-size: 0.75rem; margin-top: 5px; display: block;';
            input.parentNode.appendChild(erroSpan);
        }

        if (exibir) {
            erroSpan.textContent = mensagem;
            input.style.borderColor = '#ff4d4d';
        } else {
            erroSpan.textContent = '';
            input.style.borderColor = '#2ecc71';
        }
    }

    // --- 3. VALIDAÇÃO EM TEMPO REAL ---
    const inputsParaValidar = [
        { id: 'document', msg: 'BI inválido (Ex: 000000000LA000)', regra: regras.bi },
        { id: 'password', msg: 'Mínimo 6 caracteres, 1 maiúscula e 1 símbolo', regra: regras.senha },
        { id: 'email', msg: 'Insira um e-mail válido', regra: regras.email },
        { id: 'phone', msg: 'Telefone inválido (9 dígitos)', regra: regras.telefone }
    ];

    inputsParaValidar.forEach(campo => {
        const el = document.getElementById(campo.id);
        if (el) {
            el.addEventListener('blur', () => {
                gerenciarMensagemErro(el, campo.msg, !campo.regra(el.value));
            });
        }
    });

    // --- 4. LOGICA DE SUBMIT ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Captura de valores atuais
            const dados = {
                primeiroNome: document.getElementById('firstName').value.trim(),
                ultimoNome: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim().toLowerCase(),
                bi: document.getElementById('document').value.trim().toUpperCase(),
                telefone: document.getElementById('phone').value.trim(),
                aniversario: document.getElementById('birthDate').value,
                senha: document.getElementById('password').value,
                confirmar: document.getElementById('confirmPassword').value
            };

            // Validações de segurança antes de salvar
            if (!regras.bi(dados.bi)) { alert('BI inválido'); return; }
            if (!regras.telefone(dados.telefone)) { alert('Telefone inválido'); return; }
            if (dados.senha !== dados.confirmar) { alert('As senhas não coincidem'); return; }
            if (!dados.aniversario) { alert('Selecione a data de nascimento'); return; }

            salvarUsuario(dados);
        });
    }

    function salvarUsuario(dados) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Verifica duplicados (E-mail ou BI)
        if (usuarios.some(u => u.email === dados.email || u.bi === dados.bi)) {
            alert('Erro: E-mail ou BI já cadastrados!');
            return;
        }

        // Cria o objeto do usuário (Sempre como 'user')
        const novoUsuario = {
            id: Date.now(),
            nome: `${dados.primeiroNome} ${dados.ultimoNome}`,
            email: dados.email,
            bi: dados.bi,
            telefone: dados.telefone,
            dataNascimento: dados.aniversario,
            password: dados.senha,
            role: 'user' // Removida a verificação de admin aqui
        };

        usuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        alert('Conta criada com sucesso! Agora pode fazer o login.');
        window.location.href = 'login.html';
    }
});