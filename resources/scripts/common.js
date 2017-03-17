'use strict';

function goTo(page, system) {
	if (typeof page == 'undefined' || page == '' || page == null) {
		return false;
	}
	if (typeof system != 'undefined' && system != null && system != '') {
		localStorage.setItem('system', system);
	}
	if (page == 'region') {
		page = '/' + localStorage.getItem('system').split('/')[0];
	}
	window.location.href = page + '.html';
}

function getLocation() {
	return new Promise(function(resolve, reject) {
		let characterID = localStorage.getItem('characterID');
		if (typeof characterID == 'undefined' || characterID == '' || characterID == null) {
			return false;
		}
		let address = 'https://crest-tq.eveonline.com/characters/' + characterID.toString() + '/location/';
		let system = '';
		httpRequest('GET', address, true)
		.then(response => {
			let result = JSON.parse(response);
			system = result.solarSystem.name;
			return httpRequest('GET', result.solarSystem.href, false);
		})
		.then(response => {
			let result = JSON.parse(response);
			return httpRequest('GET', result.constellation.href, false);
		})
		.then(response => {
			let result = JSON.parse(response);
			return httpRequest('GET', result.region.href, false);
		})
		.then(response => {
			let result = JSON.parse(response);
			let location = result.name + '/' + system;
			console.log('Current location : ' + location);
			localStorage.setItem('location', location);
			resolve(location);
		})
		.catch(err => {
			reject(err);
		});
	});
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
				let refreshUrl = 'https://evescanner-gatekeeper.herokuapp.com/refresh';
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
					xhr.open(method, url);
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

