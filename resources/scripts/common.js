'use strict';

setInterval(getLocation(), 6000);

function goTo(page) {
	if (typeof page == 'undefined' || page == '' || page == null) {
		return false;
	}
	window.location.href = page + '.html';
}

function getLocation() {
	let characterID = localStorage.getItem('characterID');
	if (typeof characterID == 'undefined' || characterID == '' || characterID == null) {
		return false;
	}
    let address = 'https://crest-tq.eveonline.com/characters/' + characterID.toString() + '/location/';
	httpRequest('GET', address, true)
	.then(response => {
		let result = JSON.parse(result);
		localStorage.setItem('location', result.name);
	})
	.catch(err => {
		console.log(err);
	})
}

function httpRequest(method, url, auth, data, headers) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
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

