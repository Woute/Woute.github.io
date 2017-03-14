'use strict';
let clientID = '442ab2adf3964df48c03fdf436f39605';

window.onload = function() {
	let SSOButton = document.getElementById('SSOButton');
}

function authSSO() {
	let url = 'https://login.eveonline.com/oauth/authorize/';
	let redirect_uri = 'https%3A%2F%2Fwoute.github.io%2Fcallback.html';
	let scope = 'characterLocationRead%20characterNavigationWrite';
	let state = (Math.random() * 10).toString() + '_' + window.location.href;
	url = url + '?response_type=code&redirect_uri=' + redirect_uri + '&client_id=' + clientID + '&scope=' + scope + '&state=' + state;
	localStorage.setItem('state', state);
	window.location.href = url;
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

function httpRequest(method, url, auth, data, headers) {
  return new Promise(function (resolve, reject) {
    let xhr = new XDomainRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    if (headers) {
      Object.keys(headers).forEach(function (key) {
        xhr.setRequestHeader(key, headers[key]);
      });
    }
    if (auth) {
		let token = localStorage.getItem('token');
		xhr.setRequestHeader('Authorization', 'Bearer ' + token);
	}
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(data);
  });
}

