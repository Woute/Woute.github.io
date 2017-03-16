'use strict';

window.onload = function() {
	setInterval(getLocation(), 6000);
}

function goTo(page) {
	if (typeof page == 'undefined' || page == '' || page == null) {
		return false;
	}
	window.location.href = page + '.html';
}

function getLocation() {
	let characterID = localStorage.getItem('characterID');
	console.log('Getting location for characterID : ' + characterID);
	if (typeof characterID == 'undefined' || characterID == '' || characterID == null) {
		return false;
	}
    let address = 'https://crest-tq.eveonline.com/characters/' + characterID.toString() + '/location/';
	httpRequest('GET', address, true)
	.then(response => {
		console.log(response);
		let result = JSON.parse(response);
		console.log('Current location : ' + result.name);
		localStorage.setItem('location', result.name);
	})
	.catch(err => {
		console.log(err);
	})
}

function httpRequest(method, url, auth, data, headers) {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		let refresh = true;
		xhr.open(method, url);
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
			} else if (refresh && auth && this.status == 401) {
				let refreshUrl = 'https://evescanner-gatekeeper.herokuapp.com/authenticate';
				let refreshData = {
					'clientID': localStorage.getItem('clientID'),
					'secret': localStorage.getItem('secret'),
					'code': localStorage.getItem('refresh_token')
				}
				httpRequest('POST', refreshUrl, false, JSON.stringify(refreshData), {'Content-Type': 'application/json'})
				.then(response => {
					let result = JSON.parse(response);
					localStorage.setItem('token', result.token);
					localStorage.setItem('refresh_token', result.refresh_token);
					xhr.setRequestHeader('Authorization', 'Bearer ' + result.token);
					refresh = false;
					xhr.send(data);
				})
				.catch(err => {
					reject(err);
				})
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

