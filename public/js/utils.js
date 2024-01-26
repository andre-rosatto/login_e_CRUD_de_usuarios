export const SESSION_STORAGE = 'CRUD_login_data';
export const ENDPOINT = 'http://127.0.0.1:5000/usuarios';
export const VIACEP = 'https://viacep.com.br/ws/';

export function getDigits(value) {
	const digits = value.toString().match(/[0-9]/g) || [''];
	return digits.join('');
}

export function formatPostcode(postcode) {
	if (postcode.length > 5) {
		return postcode.slice(0, 5) + '-' + postcode.slice(5, Math.min(8, postcode.length));
	} else {
		return postcode;
	}
}

export function formatCPF(cpf) {
	if (cpf.length > 9) {
		return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9) + '-' + cpf.slice(9, Math.min(11, cpf.length));
	} else if (cpf.length > 6) {
		return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, Math.min(9, cpf.length));
	} else if (cpf.length > 3) {
		return cpf.slice(0, 3) + '.' + cpf.slice(3, Math.min(6, cpf.length));
	} else {
		return cpf;
	}
}

export function logout() {
	sessionStorage.removeItem(SESSION_STORAGE);
	window.location.href = '../';
}