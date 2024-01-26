import { ENDPOINT, SESSION_STORAGE, logout } from "./utils.js";

const login_info = sessionStorage.getItem(SESSION_STORAGE);
if (!login_info) {
	window.location.href = '../';
} else {
	document.querySelector('#login-name').innerText = login_info;
	init();
}

function init() {
	fetchItems();
	document.querySelector('#btn-logout').addEventListener('click', logout);
	document.querySelector('#search input').addEventListener('input', onSearchInput);
}

function fetchItems(filter) {
	const endpoint = filter ? `${ENDPOINT}?q=${filter}` : ENDPOINT;
	fetch(endpoint, { method: 'GET' })
		.then(res => res.json())
		.then(json => {
			makeList(json)
		});
}

function makeList(items) {
	document.querySelector('table tbody').innerHTML = '';
	items.forEach(item => {
		makeItem(item);
	});
}

function makeItem(item) {
	const tr = document.createElement('tr');
	tr.innerHTML = `
		<td>${item['nome']}</td>
		<td>${item['cpf']}</td>
		<td>${item['email']}</td>
		<td>${item['endereco']['cidade']}</td>
		<td>
			<button class="btn-edit">Editar</button>
			<button class="btn-delete">Apagar</button>
		</td>
	`;
	tr.querySelector('.btn-edit').addEventListener('click', () => onEditClick(item));
	tr.querySelector('.btn-delete').addEventListener('click', () => onDeleteClick(tr, item));
	document.querySelector('table tbody').append(tr);
}

function onEditClick(item) {
	window.location.href = `./edit.html?id=${item.id}`;
}

function onDeleteClick(tr, item) {
	if (confirm(`Tem certeza que quer apagar este humano?\n\nNome: ${item['nome']}\nCPF: ${item['cpf']}\nE-mail: ${item['email']}\nCidade: ${item['endereco']['cidade']}`)) {
		fetch(`${ENDPOINT}/${item.id}`, { method: 'DELETE' })
			.then(() => {
				tr.remove();
			});
	}
}

function onSearchInput(e) {
	fetchItems(e.target.value);
}