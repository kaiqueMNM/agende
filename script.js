const form = document.getElementById('form-agendamento');
const listaAgendamentos = document.getElementById('lista-agendamentos');
const modalAtualizar = document.getElementById('modal-atualizar');
const formAtualizar = document.getElementById('form-atualizar');
const containerPost = document.getElementById('container-post');
const errorMessage = document.getElementById('error-message');
let idAtualizar = null; // ID do agendamento que será atualizado

const getAgendamentos = () => JSON.parse(localStorage.getItem('agendamentos')) || [];
const salvarAgendamentos = (agendamentos) => localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

const adicionarAgendamento = (agendamento) => {
  const agendamentos = getAgendamentos();
  agendamento.id = Date.now();
  agendamento.concluido = false; // Estado inicial do agendamento
  agendamentos.push(agendamento);
  salvarAgendamentos(agendamentos);
};

const removerAgendamento = (id) => {
  const agendamentos = getAgendamentos();
  const novosAgendamentos = agendamentos.filter((ag) => ag.id !== id);
  salvarAgendamentos(novosAgendamentos);
};

const atualizarAgendamento = (id, novoAgendamento) => {
  const agendamentos = getAgendamentos();
  const index = agendamentos.findIndex((ag) => ag.id === id);
  if (index !== -1) {
    agendamentos[index] = { id, ...novoAgendamento };
    salvarAgendamentos(agendamentos);
  }
};

const formatarData = (data) => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

const renderizarAgendamentos = () => {
  const agendamentos = getAgendamentos();
  listaAgendamentos.innerHTML = '';
  agendamentos.forEach((ag) => {
    const li = document.createElement('li');
    li.style.backgroundColor = ag.concluido ? 'lightgreen' : ''; // Define a cor do card
    li.innerHTML = `
      <strong>${ag.nome}</strong> <br>
      ${formatarData(ag.data)} às ${ag.horario} <br>
      Procedimento: ${ag.procedimento || "Não especificado"} <br>
      Telefone: ${ag.telefone}
    `;

    const buttons = document.createElement('div');
    buttons.className = 'buttons';

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = () => {
      removerAgendamento(ag.id);
      renderizarAgendamentos();
    };

    const btnAtualizar = document.createElement('button');
    btnAtualizar.textContent = 'Atualizar';
    btnAtualizar.onclick = () => abrirAtualizar(ag);

    const btnConcluir = document.createElement('button');
    btnConcluir.textContent = ag.concluido ? 'Desfazer' : 'Concluído';
    btnConcluir.onclick = () => {
      ag.concluido = !ag.concluido; // Alterna entre concluído e não concluído
      salvarAgendamentos(agendamentos);
      renderizarAgendamentos();
    };

    buttons.appendChild(btnRemover);
    buttons.appendChild(btnAtualizar);
    buttons.appendChild(btnConcluir);
    li.appendChild(buttons);

    listaAgendamentos.appendChild(li);
  });
};

const abrirAtualizar = (agendamento) => {
  idAtualizar = agendamento.id;
  document.getElementById('novo-nome').value = agendamento.nome;
  document.getElementById('nova-data').value = agendamento.data;
  document.getElementById('novo-horario').value = agendamento.horario;
  document.getElementById('novo-procedimento').value = agendamento.procedimento;
  document.getElementById('novo-telefone').value = agendamento.telefone;
  containerPost.style.display = 'none';
  modalAtualizar.style.display = 'block';
};

const fecharAtualizar = () => {
  modalAtualizar.style.display = 'none';
  containerPost.style.display = 'block';
  idAtualizar = null;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;
  const procedimento = document.getElementById('procedimento').value;
  const telefone = document.getElementById('telefone').value;

  // Validação
  if (!nome || !data || !horario || !telefone) {
    errorMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
    errorMessage.style.display = 'block';
    return;
  }

  adicionarAgendamento({ nome, data, horario, procedimento, telefone });
  form.reset();
  errorMessage.style.display = 'none';
  renderizarAgendamentos();
});

formAtualizar.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('novo-nome').value;
  const data = document.getElementById('nova-data').value;
  const horario = document.getElementById('novo-horario').value;
  const procedimento = document.getElementById('novo-procedimento').value;
  const telefone = document.getElementById('novo-telefone').value;

  // Validação
  if (!nome || !data || !horario || !telefone) {
    errorMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
    errorMessage.style.display = 'block';
    return;
  }

  atualizarAgendamento(idAtualizar, { nome, data, horario, procedimento, telefone });
  fecharAtualizar();
  errorMessage.style.display = 'none';
  renderizarAgendamentos();
});

document.getElementById('cancelar-atualizacao').addEventListener('click', fecharAtualizar);

renderizarAgendamentos();
