'use strict';

document.onkeyup = function(e) {
	if (e.keyCode == 32) {
		goTo(localStorage.getItem("location"));
	}
	if (e.keyCode == 8) {
		if (document.title != 'New Eden') {
			goTo('/index');
		}
	}
}

function authSSO() {
	let url = 'https://login.eveonline.com/oauth/authorize/';
	let redirect_uri = 'https%3A%2F%2Fwoute.github.io%2Fcallback.html';
	let scope = 'characterLocationRead%20characterNavigationWrite';
	let state = (Math.random() * 10).toString() + '_' + window.location.href;
	let clientID = localStorage.getItem('clientID');
	url = url + '?response_type=code&redirect_uri=' + redirect_uri + '&client_id=' + clientID + '&scope=' + scope + '&state=' + state;
	localStorage.setItem('state', state);
	window.location.href = url;
}

function readCredentials() {
	let clientID = document.getElementById('clientID').value;
	let secret = document.getElementById('secret').value;
	localStorage.setItem('clientID', clientID);
	localStorage.setItem('secret', secret);
	clientID = '';
	secret = '';
}
