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

function httpRequest(address, reqType, contentType, data, asyncProc) {
   var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
   if (asyncProc) 
      r.onreadystatechange = function () { 
          if (this.readyState == 4) asyncProc(this); 
      }; 
   else 
      r.timeout = 4000;  // Reduce default 2mn-like timeout to 4 s if synchronous
   r.open(reqType, address, !(!asyncProc));
   if (contentType) r.setRequestHeader('Content-Type', contentType);
   r.send(data);
   return r;
}
