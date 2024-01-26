import { SESSION_STORAGE } from "./utils.js";

document.querySelector('form').addEventListener('submit', onFormSubmit);
if (sessionStorage.getItem(SESSION_STORAGE)) {
	window.location.href = './pages/listing.html';
}

function onFormSubmit(e) {
	e.preventDefault();
	sessionStorage.setItem(SESSION_STORAGE, document.querySelector('#email').value);
	window.location.href = './pages/listing.html';
}