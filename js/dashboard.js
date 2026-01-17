document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Iniciar Interface
    document.getElementById('userName').textContent = usuarioLogado.nome;
    carregarPainel();
    setInterval(carregarPainel, 60000);
    configurarFiltros();

    // 2. Lógica do Modal de Avaliações (Comentários)
    inicializarModalAvaliacao(usuarioLogado);
});

// --- LÓGICA DAS CONSULTAS ---

function carregarPainel(filtroAtivo = 'Todas') {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const todasConsultas = JSON.parse(localStorage.getItem('consultas')) || [];
    
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

    // Card de Destaque
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
        cardProxima.querySelector('.appointment-actions').innerHTML = `
            <button class="btn-cancel" onclick="removerConsulta('${prox.id}')">Cancelar Consulta</button>
        `;
    } else if (cardProxima) {
        cardProxima.style.display = 'none';
    }

    // Lista Geral
    let listaFiltrada = lista;
    if (filtro === 'Próximas') listaFiltrada = lista.filter(c => !c.estaPassada);
    if (filtro === 'Passadas') listaFiltrada = lista.filter(c => c.estaPassada);

    listaFiltrada.sort((a, b) => a.objData - b.objData);
    containerLista.innerHTML = ''; 

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
                    <button class="btn-delete-item" onclick="removerConsulta('${c.id}')">
                        <i data-feather="x-circle"></i>
                    </button>
                ` : ''}
            </div>
        `;
    });
    feather.replace();
}

// --- LÓGICA DO MODAL DE AVALIAÇÃO ---

function inicializarModalAvaliacao(usuarioLogado) {
    const btnAbrir = document.getElementById('btnAbrirComentario');
    const modal = document.getElementById('modalComentario');
    const btnFechar = document.getElementById('btnFecharModal');
    const btnSalvar = document.getElementById('btnSalvarComentario');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('ratingValue');

    if (btnAbrir && modal) {
        btnAbrir.onclick = () => modal.style.display = 'flex';
    }

    if (btnFechar) {
        btnFechar.onclick = () => {
            modal.style.display = 'none';
            resetarModal();
        };
    }

    stars.forEach(star => {
        star.onclick = function() {
            const val = this.getAttribute('data-value');
            ratingInput.value = val;
            stars.forEach(s => s.innerHTML = s.getAttribute('data-value') <= val ? '★' : '☆');
        };
    });

    if (btnSalvar) {
        btnSalvar.onclick = () => {
            const mensagem = document.getElementById('textoComentario').value.trim();
            const estrelas = parseInt(ratingInput.value);

            if (estrelas === 0 || mensagem === "") {
                alert("Por favor, preencha a mensagem e selecione as estrelas.");
                return;
            }

            const novoComentario = {
                id: Date.now(),
                usuarioNome: usuarioLogado.nome,
                mensagem: mensagem,
                estrelas: estrelas,
                data: new Date().toLocaleDateString('pt-AO')
            };

            const comentarios = JSON.parse(localStorage.getItem('comentariosSite')) || [];
            comentarios.push(novoComentario);
            localStorage.setItem('comentariosSite', JSON.stringify(comentarios));

            alert("Obrigado pelo seu comentário!");
            modal.style.display = 'none';
            resetarModal();
        };
    }

    function resetarModal() {
        document.getElementById('textoComentario').value = '';
        ratingInput.value = '0';
        stars.forEach(s => s.innerHTML = '☆');
    }
}

// Funções Globais
window.removerConsulta = function(id) {
    if (confirm("Tens a certeza que desejas cancelar esta consulta?")) {
        let todas = JSON.parse(localStorage.getItem('consultas')) || [];
        todas = todas.filter(c => String(c.id) !== String(id));
        localStorage.setItem('consultas', JSON.stringify(todas));
        carregarPainel();
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