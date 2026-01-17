document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const profileForm = document.getElementById('profileForm');

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Preencher os dados na tela
    document.getElementById('fullName').value = usuarioLogado.nome;
    document.getElementById('email').value = usuarioLogado.email;
    document.getElementById('phone').value = usuarioLogado.telefone;
    document.getElementById('document').value = usuarioLogado.bi;
    document.getElementById('birthDate').value = usuarioLogado.dataNascimento;
    document.getElementById('displayID').textContent = usuarioLogado.id.toString().slice(-6);

    // Gerar iniciais para o avatar grande
    const nomes = usuarioLogado.nome.split(' ');
    const iniciais = nomes.length > 1 
        ? (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase() 
        : nomes[0][0].toUpperCase();
    document.getElementById('userInitials').textContent = iniciais;

    // 2. Salvar Alterações
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const novoNome = document.getElementById('fullName').value;
        const novoEmail = document.getElementById('email').value;
        const novoTelefone = document.getElementById('phone').value;
        const novaData = document.getElementById('birthDate').value;

        // Atualizar objeto do usuário logado
        usuarioLogado.nome = novoNome;
        usuarioLogado.email = novoEmail;
        usuarioLogado.telefone = novoTelefone;
        usuarioLogado.dataNascimento = novaData;

        // Atualizar no LocalStorage (Sessão atual)
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        // Atualizar no "Banco Central" (Lista de todos os usuários)
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];
        const index = usuariosCadastrados.findIndex(u => u.id === usuarioLogado.id);
        
        if (index !== -1) {
            usuariosCadastrados[index] = usuarioLogado;
            localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados));
        }

        alert('Perfil atualizado com sucesso!');
        location.reload(); // Recarrega para atualizar a Sidebar e Navbar
    });
});