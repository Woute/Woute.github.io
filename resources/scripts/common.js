'use strict';

function goTo(page) {
	if (page == "") {
		return true;
	}
	window.location.href = page + '.html';
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

