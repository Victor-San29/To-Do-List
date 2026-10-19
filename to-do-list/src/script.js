const formulario = document.querySelector('#form-tarefa');
const lista = document.querySelector('#lista-tarefas');
const titulo = document.querySelector('#tarefa');
const descricao = document.querySelector('#descricao');
const prazo = document.querySelector('#prazo');
const status = document.querySelector('#status');
const botaoAdicionar = formulario.querySelector('button[type="submit"]');
const botaoCancelar = document.querySelector('#cancelar-edicao');
const botaoExcluir = document.querySelector('#remover-tarefa');
const botaoEditar = document.querySelector('#editar-tarefa');
const nomesStatus = {
    PENDENTE: 'Não feita',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída'
};

let tarefaSelecionada = null;
let tarefaEditada = null;
let proximoId = 1;

function criarTarefa(dados) {
    const tarefa = document.createElement('li');
    tarefa.className = 'cartao-tarefa';
    tarefa.dataset.status = dados.status;

    const seletor = document.createElement('input');
    seletor.type = 'radio';
    seletor.name = 'tarefa-selecionada';
    seletor.setAttribute('onchange', 'selecionarTarefa(this)');
    const rotuloSeletor = document.createElement('label');
    rotuloSeletor.className = 'selecao-tarefa';
    rotuloSeletor.append(seletor, ' Selecionar tarefa');

    const tituloTarefa = document.createElement('strong');
    tituloTarefa.className = 'titulo-tarefa';
    tituloTarefa.textContent = dados.titulo;

    const descricaoTarefa = document.createElement('p');
    descricaoTarefa.className = 'descricao-tarefa';
    descricaoTarefa.textContent = dados.descricao;

    const datas = document.createElement('div');
    datas.className = 'datas-tarefa';

    const dataCriacao = document.createElement('time');
    dataCriacao.textContent = `Criada em: ${new Date().toLocaleDateString('pt-BR')}`;

    const dataPrazo = document.createElement('time');
    dataPrazo.className = 'prazo-tarefa';
    dataPrazo.dateTime = dados.prazo;
    dataPrazo.textContent = `Prazo: ${new Date(`${dados.prazo}T00:00:00`).toLocaleDateString('pt-BR')}`;
    datas.append(dataCriacao, dataPrazo);

    const statusTarefa = document.createElement('fieldset');
    statusTarefa.className = 'checklist-status';
    const legenda = document.createElement('legend');
    legenda.textContent = 'Status';
    statusTarefa.appendChild(legenda);
    const nomeGrupoStatus = `status-${proximoId}`;
    proximoId++;

    for (const valor in nomesStatus) {
        const rotulo = document.createElement('label');
        rotulo.className = 'opcao-status';

        const opcao = document.createElement('input');
        opcao.type = 'radio';
        opcao.name = nomeGrupoStatus;
        opcao.value = valor;
        opcao.checked = valor === dados.status;
        opcao.setAttribute('onchange', 'alterarStatus(this)');

        rotulo.append(opcao, ` ${nomesStatus[valor]}`);
        statusTarefa.appendChild(rotulo);
    }

    tarefa.append(rotuloSeletor, tituloTarefa, descricaoTarefa, datas, statusTarefa);
    lista.appendChild(tarefa);
}

function atualizarBotoes() {
    botaoExcluir.disabled = !tarefaSelecionada || tarefaEditada;
    botaoEditar.disabled = !tarefaSelecionada || tarefaEditada;
}

function terminarEdicao() {
    tarefaEditada = null;
    formulario.reset();
    status.disabled = true;
    botaoAdicionar.textContent = 'Adicionar';
    botaoCancelar.hidden = true;
    lista.querySelectorAll('input[name="tarefa-selecionada"]').forEach(campo => {
        campo.disabled = false;
    });
    atualizarBotoes();
}

function salvarTarefa(evento) {
    evento.preventDefault();

    const dados = {
        titulo: titulo.value.trim(),
        descricao: descricao.value.trim(),
        prazo: prazo.value,
        status: status.value
    };

    if (!dados.titulo || !dados.descricao) {
        alert('Preencha o título e a descrição.');
        return;
    }

    if (tarefaEditada) {
        tarefaEditada.querySelector('.titulo-tarefa').textContent = dados.titulo;
        tarefaEditada.querySelector('.descricao-tarefa').textContent = dados.descricao;

        const dataPrazo = tarefaEditada.querySelector('.prazo-tarefa');
        dataPrazo.dateTime = dados.prazo;
        dataPrazo.textContent = `Prazo: ${new Date(`${dados.prazo}T00:00:00`).toLocaleDateString('pt-BR')}`;

        tarefaEditada.dataset.status = dados.status;
        tarefaEditada.querySelectorAll('.opcao-status input').forEach(opcao => {
            opcao.checked = opcao.value === dados.status;
        });
        tarefaSelecionada = tarefaEditada;
        terminarEdicao();
        return false;
    }

    criarTarefa({
        ...dados,
        status: 'PENDENTE'
    });
    formulario.reset();
    return false;
}

function selecionarTarefa(campo) {
    tarefaSelecionada = campo.closest('.cartao-tarefa');
    atualizarBotoes();
}

function alterarStatus(campo) {
    campo.closest('.cartao-tarefa').dataset.status = campo.value;
}

function removerTarefa() {
    if (tarefaSelecionada) {
        tarefaSelecionada.remove();
        tarefaSelecionada = null;
        atualizarBotoes();
    }
}

function editarTarefa() {
    if (!tarefaSelecionada) {
        return;
    }

    tarefaEditada = tarefaSelecionada;
    titulo.value = tarefaEditada.querySelector('.titulo-tarefa').textContent;
    descricao.value = tarefaEditada.querySelector('.descricao-tarefa').textContent;
    prazo.value = tarefaEditada.querySelector('.prazo-tarefa').dateTime;
    status.value = tarefaEditada.dataset.status;
    status.disabled = false;
    botaoAdicionar.textContent = 'Salvar alterações';
    botaoCancelar.hidden = false;

    lista.querySelectorAll('input[name="tarefa-selecionada"]').forEach(campo => {
        campo.disabled = true;
    });
    atualizarBotoes();
}
