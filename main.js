"use strict";

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};
const openModal = () =>
  document.getElementById("modal").classList.add("active");
const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

const deleteClient = (index) => {
  const dbClient = getLocalStorage();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
  const dbClient = getLocalStorage();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};

const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};

//eventos

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      celular: document.getElementById("celular").value,
      cidade: document.getElementById("cidade").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      createClient(client);
      updateTable();
      closeModal();
    } else {
      updateClient(index, client);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (client, index) => {
  const newClient = document.createElement("tr");
  newClient.innerHTML = `<td>${client.nome}</td>
   <td>${client.email}</td>
   <td>${client.celular}</td>
   <td>${client.cidade}</td>
   <td>
    <button type="button" class="button green"  data-action="editar-${index}">editar</button>
    <button type="button" class="button red " data-action="deletar-${index}">excluir</button>
    </td>`;
  document.querySelector("#tbClient>tbody").appendChild(newClient);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tbClient>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbCliente = getLocalStorage();
  clearTable();
  dbCliente.forEach(createRow);
};

updateTable();

const fillFields = (client) => {
  document.getElementById("nome").value = client.nome;
  document.getElementById("celular").value = client.celular;
  document.getElementById("cidade").value = client.cidade;
  document.getElementById("email").value = client.email;
  document.getElementById("nome").dataset.index = client.index;
};

const editClient = (index) => {
  const client = getLocalStorage()[index];
  client.index = index;
  fillFields(client);
  openModal();
};

const editDelete = (e) => {
  if (e.target.type == "button") {
    const [action, index] = e.target.dataset.action.split("-");
    if (action == "editar") {
      editClient(index);
    } else {
      deleteClient(index);
      updateTable();
    }
  }
};

document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("salvar").addEventListener("click", saveClient);
document.querySelector("#tbClient>tbody").addEventListener("click", editDelete);
