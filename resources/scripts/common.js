var clientID = '442ab2adf3964df48c03fdf436f39605';

window.onload = function() {
	var SSOButton = document.getElementById('SSOButton');
}

function authSSO() {
	var url = 'https://login.eveonline.com/oauth/authorize/';
	var redirect_uri = 'https%3A%2F%2Fwoute.github.io%2Fcallback.html';
	var scope = 'characterLocationRead%20characterNavigationWrite';
	var state = (Math.random() * 10).toString();
	url = url + '?response_type=code&redirect_uri=' + redirect_uri + '&client_id=' + clientID + '&scope=' + scope + '&state=' + state;
	console.log(url);
}

function goTo(page) {
	if (page == "") {
		return true;
	}
	window.location.href = page + '.html';
}

function setDestination(id) {
    console.log(id);
    return false;
}

