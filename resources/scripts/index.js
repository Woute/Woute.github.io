'use strict';

function authSSO() {
	let url = 'https://login.eveonline.com/oauth/authorize/';
	let redirect_uri = 'https%3A%2F%2Fwoute.github.io%2Fcallback.html';
	let scope = 'characterLocationRead%20characterNavigationWrite';
	let state = (Math.random() * 10).toString() + '_' + window.location.href;
	url = url + '?response_type=code&redirect_uri=' + redirect_uri + '&client_id=' + clientID + '&scope=' + scope + '&state=' + state;
	localStorage.setItem('state', state);
	window.location.href = url;
}
