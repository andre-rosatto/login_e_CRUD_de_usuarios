import { SESSION_STORAGE, VIACEP, formatPostcode, getDigits, logout, formatCPF, ENDPOINT } from "./utils.js";

const login_info = sessionStorage.getItem(SESSION_STORAGE);

let id;

if (!login_info) {
	window.location.href = '../';
} else {
	document.querySelector('#login-name').innerText = login_info;
	init();
	const searchParams = new URLSearchParams(window.location.search);
	id = searchParams.get('id');
	if (id) {
		fillForm();
	}
	document.querySelector('form button').innerText = id ? 'Atualizar humano' : 'Adicionar humano';
}

function init() {
	document.querySelector('#btn-logout').addEventListener('click', logout);
	document.querySelector('form').addEventListener('submit', onSubmit);
	document.querySelector('#cpf').addEventListener('input', onCPFInput);
	document.querySelector('#postcode').addEventListener('input', onPostcodeInput);
}

function fillForm() {
	fetch(`${ENDPOINT}/${id}`, { method: 'GET' })
		.then(res => res.json())
		.then(json => {
			document.querySelector('#name').value = json['nome'];
			document.querySelector('#cpf').value = json['cpf'];
			document.querySelector('#email').value = json['email'];
			document.querySelector('#postcode').value = formatPostcode(json['endereco']['cep']);
			document.querySelector('#street').value = json['endereco']['rua'];
			document.querySelector('#number').value = json['endereco']['numero'];
			document.querySelector('#district').value = json['endereco']['bairro'];
			document.querySelector('#city').value = json['endereco']['cidade'];
		});
}

function fillAddress(postcode) {
	fetch(`${VIACEP}${postcode}/json/`, { method: 'GET' })
		.then(res => res.json())
		.then(json => {
			if (json['erro']) {
				document.querySelector('#postcode-error').classList.add('show');
				clearAddress();
			} else {
				document.querySelector('#street').value = json['logradouro'];
				document.querySelector('#district').value = json['bairro'];
				document.querySelector('#city').value = json['localidade'];
				document.querySelector('#number').focus();
			}
		});
}

function clearForm() {
	clearAddress();
	document.querySelector('#name').value = '';
	document.querySelector('#cpf').value = '';
	document.querySelector('#email').value = '';
	document.querySelector('#postcode').value = '';
	document.querySelector('#number').value = '';
}

function clearAddress() {
	document.querySelector('#street').value = '';
	document.querySelector('#district').value = '';
	document.querySelector('#city').value = '';
}

function onCPFInput(e) {
	const digits = getDigits(e.target.value);
	e.target.value = formatCPF(digits);
	if (e.target.value.length === 14) {
		document.querySelector('#email').focus();
	}
}

function onPostcodeInput(e) {
	const digits = getDigits(e.target.value);
	e.target.value = formatPostcode(digits);
	document.querySelector('#postcode-error').classList.remove('show');
	if (digits.length === 8) {
		fillAddress(digits);
	} else {
		clearAddress();
	}
}

function onSubmit(e) {
	e.preventDefault();
	const data = {
		'nome': document.querySelector('#name').value,
		'cpf': document.querySelector('#cpf').value,
		'email': document.querySelector('#email').value,
		'endereco': {
			'cep': parseInt(getDigits(document.querySelector('#postcode').value)),
			'rua': document.querySelector('#street').value,
			'numero': parseInt(document.querySelector('#number').value),
			'bairro': document.querySelector('#district').value,
			'cidade': document.querySelector('#city').value
		}
	};
	const method = id ? 'PUT' : 'POST';
	const endpoint = id ? `${ENDPOINT}/${id}` : ENDPOINT;
	fetch(endpoint, {
		method: method, body: JSON.stringify(data),
		headers: {
			'content-type': 'application/json; charset=utf-8'
		}
	})
		.then(() => {
			if (id) {
				window.location.href = './listing.html';
			} else {
				document.querySelector('#add-response').classList.add('show');
				setTimeout(() => {
					document.querySelector('#add-response').classList.remove('show');
				}, 2000);
				clearForm();
			}
		});
}