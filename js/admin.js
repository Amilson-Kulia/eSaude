document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificação de Segurança (Session)
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));



    // 2. Carregar Dados do LocalStorage (onde os cadastros ficam guardados)
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    const feedbacks = JSON.parse(localStorage.getItem('comentariosSite')) || [];

    // 3. Atualizar Contadores
    document.getElementById('totalUsers').textContent = usuarios.length;
    document.getElementById('totalConsultas').textContent = consultas.length;
    document.getElementById('totalFeedbacks').textContent = feedbacks.length;

    // 4. Renderizar Tabela de Usuários
    const usersBody = document.querySelector('#usersTable tbody');
    if (usersBody) {
        usersBody.innerHTML = usuarios.map(u => `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.bi}</td>
                <td><button class="btn-delete" onclick="removerUsuario('${u.id}')">Eliminar</button></td>
            </tr>
        `).join('');
    }

    // 5. Renderizar Tabela de Consultas
    const consultasBody = document.querySelector('#consultasTable tbody');
    if (consultasBody) {
        consultasBody.innerHTML = consultas.map(c => `
            <tr>
                <td>${c.usuarioNome || 'N/A'}</td>
                <td>${c.usuarioTelefone || c.telefone || 'N/A'}</td>
                <td>${c.posto}</td>
                <td>${c.especialidade}</td>
                <td>${c.data} às ${c.hora}</td>
                <td><span class="badge ${c.urgencia}">${c.urgencia}</span></td>
            </tr>
        `).join('');
    }

    if (typeof feather !== 'undefined') feather.replace();
});

// Funções de Eliminação
window.removerUsuario = function(id) {
    if(confirm("Deseja eliminar este usuário?")) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios = usuarios.filter(u => u.id != id);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        location.reload();
    }
};