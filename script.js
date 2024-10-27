let contador = 0;
let input = document.getElementById("inputTarefa");
let btnAdd = document.getElementById("btnAdd");
let main = document.getElementById("areaLista");

// Carregar tarefas ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarTarefas);

// Adicionar evento de clique ao botão
btnAdd.addEventListener("click", addTarefa);

function addTarefa() {
  let valorInput = input.value;

  if (valorInput !== "" && valorInput !== null && valorInput !== undefined) {
    ++contador;

    let novaTarefa = {
      id: contador,
      nome: valorInput,
      concluida: false
    };

    adicionarItemNaTela(novaTarefa);
    salvarTarefa(novaTarefa);

    input.value = "";
    input.focus();
  }
}

function adicionarItemNaTela(tarefa) {
  let novoItem = `<div id="${tarefa.id}" class="item list-group-item d-flex justify-content-between align-items-center ${tarefa.concluida ? 'clicado' : ''}">
      <div onclick="marcarTarefa(${tarefa.id})" class="item-icone">
          <i id="icone_${tarefa.id}" class="mdi ${tarefa.concluida ? 'mdi-check-circle' : 'mdi-circle-outline'}"></i>
      </div>
      <div onclick="marcarTarefa(${tarefa.id})" class="item-nome flex-grow-1 ms-3">
          ${tarefa.nome}
      </div>
      <div class="item-botao">
          <button onclick="deletar(${tarefa.id})" class="btn btn-danger delete"><i class="mdi mdi-delete"></i> Deletar</button>
      </div>
  </div>`;

  main.innerHTML += novoItem;
}

function salvarTarefa(tarefa) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.forEach(tarefa => {
    if (tarefa.id > contador) contador = tarefa.id;
    adicionarItemNaTela(tarefa);
  });
}

function deletar(id) {
  let tarefa = document.getElementById(id);
  if (tarefa) tarefa.remove();

  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas = tarefas.filter(t => t.id !== id);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function marcarTarefa(id) {
  let item = document.getElementById(id);
  let icone = document.getElementById("icone_" + id);
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  // Atualiza a tarefa e a exibe como concluída ou não
  tarefas = tarefas.map(t => {
    if (t.id === id) {
      t.concluida = !t.concluida;
      if (t.concluida) {
        item.classList.add("clicado");
        icone.classList.remove("mdi-circle-outline");
        icone.classList.add("mdi-check-circle");
        // Move o item para o final da lista
        main.appendChild(item);
      } else {
        item.classList.remove("clicado");
        icone.classList.remove("mdi-check-circle");
        icone.classList.add("mdi-circle-outline");
        // Move o item para o topo da lista
        main.insertBefore(item, main.firstChild);
      }
    }
    return t;
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Permitir adição da tarefa ao pressionar Enter
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTarefa();
  }
});
