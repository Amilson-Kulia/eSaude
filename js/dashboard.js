document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = usuarioLogado.nome;

    carregarPainel();
    setInterval(carregarPainel, 60000);
    configurarFiltros();
});

function carregarPainel(filtroAtivo = 'Todas') {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const todasConsultas = JSON.parse(localStorage.getItem('consultas')) || [];
    
    // Filtra consultas deste usuário específico
    const minhasConsultas = todasConsultas.filter(c => 
        c.usuarioId === usuarioLogado.id || c.usuarioEmail === usuarioLogado.email
    );

    const agora = new Date();
    
    const consultasProcessadas = minhasConsultas.map(c => {
        const dataConsulta = new Date(`${c.data}T${c.hora}`);
        const diffMs = dataConsulta - agora;
        return {
            ...c,
            estaPassada: diffMs < 0,
            horasRestantes: diffMs / (1000 * 60 * 60),
            objData: dataConsulta
        };
    });

    renderizarConsultas(consultasProcessadas, filtroAtivo);
}

function renderizarConsultas(lista, filtro) {
    const containerLista = document.querySelector('.appointments');
    const cardProxima = document.querySelector('.appointment-card.upcoming');

    // 1. Lógica do Card de Destaque (A consulta mais próxima que não passou)
    const futuras = lista.filter(c => !c.estaPassada).sort((a, b) => a.objData - b.objData);
    
    if (futuras.length > 0 && cardProxima) {
        const prox = futuras[0];
        cardProxima.style.display = 'block';
        cardProxima.querySelector('.appointment-details').innerHTML = `
            <div class="detail"><i data-feather="calendar"></i><span>${formatarData(prox.data)}</span></div>
            <div class="detail"><i data-feather="clock"></i><span>${prox.hora}</span></div>
            <div class="detail"><i data-feather="map-pin"></i><span>${prox.posto}</span></div>
            <div class="detail"><i data-feather="user"></i><span>${prox.especialidade}</span></div>
        `;
        // Botão Cancelar do Card Principal
        cardProxima.querySelector('.appointment-actions').innerHTML = `
            <button class="btn-cancel" onclick="removerConsulta('${prox.id}')">Cancelar Consulta</button>
        `;
    } else if (cardProxima) {
        cardProxima.style.display = 'none';
    }

    // 2. Lógica da Lista Geral
    let listaFiltrada = lista;
    if (filtro === 'Próximas') listaFiltrada = lista.filter(c => !c.estaPassada);
    if (filtro === 'Passadas') listaFiltrada = lista.filter(c => c.estaPassada);

    listaFiltrada.sort((a, b) => a.objData - b.objData);

    containerLista.innerHTML = ''; // Limpa as consultas estáticas do HTML

    if (listaFiltrada.length === 0) {
        containerLista.innerHTML = `<p style="padding:20px; text-align:center;">Nenhuma consulta encontrada.</p>`;
        return;
    }

    listaFiltrada.forEach(c => {
        let statusClass = c.estaPassada ? 'completed' : (c.horasRestantes < 1 ? 'urgent' : 'upcoming');
        let statusTexto = c.estaPassada ? 'Realizada' : (c.horasRestantes < 1 ? 'É AGORA!' : 'Agendada');

        containerLista.innerHTML += `
            <div class="appointment-item">
                <div class="appointment-info">
                    <h3>Consulta de ${c.especialidade}</h3>
                    <p><i data-feather="calendar"></i> ${formatarData(c.data)} - ${c.hora}</p>
                    <p><i data-feather="map-pin"></i> ${c.posto}</p>
                </div>
                <div class="appointment-status ${statusClass}">
                    <i data-feather="${c.estaPassada ? 'check' : 'clock'}"></i>
                    <span>${statusTexto}</span>
                </div>
                ${!c.estaPassada ? `
                    <button class="btn-delete-item" onclick="removerConsulta('${c.id}')" title="Cancelar">
                        <i data-feather="x-circle"></i>
                    </button>
                ` : ''}
            </div>
        `;
    });
    feather.replace();
}

// FUNÇÃO PARA CANCELAR/REMOVER
window.removerConsulta = function(id) {
    if (confirm("Tens a certeza que desejas cancelar esta consulta?")) {
        let todas = JSON.parse(localStorage.getItem('consultas')) || [];
        // Filtra para remover a consulta com o ID correspondente
        todas = todas.filter(c => String(c.id) !== String(id));
        localStorage.setItem('consultas', JSON.stringify(todas));
        carregarPainel(); // Recarrega a tela na hora
    }
};

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-AO');
}

function configurarFiltros() {
    const buttons = document.querySelectorAll('.view-options button');
    buttons.forEach(btn => {
        btn.onclick = () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            carregarPainel(btn.textContent);
        };
    });
}