document.addEventListener('DOMContentLoaded', () => {
    const formConsulta = document.getElementById('formConsulta');
    const btnCancelar = document.getElementById('cancelar');

    // 1. Verificar se o usuário está logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert('Você precisa estar logado para agendar uma consulta!');
        window.location.href = 'login.html';
        return;
    }

    if (formConsulta) {
        formConsulta.addEventListener('submit', (e) => {
            e.preventDefault();

            // 2. Capturar dados do formulário com segurança
            const posto = document.getElementById('posto').value;
            const especialidade = document.getElementById('especialidade').value;
            const urgencia = document.getElementById('urgencia').value;
            const data = document.getElementById('data').value;
            const hora = document.getElementById('hora').value;

            // Validação simples
            if (!posto || !especialidade || !data || !hora) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // 3. Criar o objeto da consulta vinculado ao usuário logado
            const novaConsulta = {
                id: Date.now(), // ID único para poder deletar depois
                usuarioId: usuarioLogado.id, 
                usuarioNome: usuarioLogado.nome,
                posto: posto,
                especialidade: especialidade,
                urgencia: urgencia,
                data: data,
                hora: hora,
                status: 'Agendada',
                dataCriacao: new Date().toISOString()
            };

            try {
                // 4. Salvar na lista global de consultas
                const consultasExistentes = JSON.parse(localStorage.getItem('consultas')) || [];
                consultasExistentes.push(novaConsulta);
                localStorage.setItem('consultas', JSON.stringify(consultasExistentes));

                alert(`Consulta de ${especialidade} agendada com sucesso!`);
                
                // 5. Redirecionar para o dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Erro ao salvar consulta:", error);
                alert("Erro ao salvar os dados no navegador.");
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (confirm('Deseja descartar as alterações e voltar ao painel?')) {
                window.location.href = 'dashboard.html';
            }
        });
    }
});