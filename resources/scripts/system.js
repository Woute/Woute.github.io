'use strict';
let cache = {};
let signatures = {};

window.onload = function() {
	changeSystem();
	setInterval(function() {
		getLocation()
		.then(location => {
			let tracking = localStorage.getItem('tracking');
			let system = JSON.parse(localStorage.getItem('system'));
			if ((tracking == 'enabled' || tracking == null) && system.id != location.id) {
				localStorage.setItem('system', JSON.stringify(location));
				changeSystem();
			}
		})
		.catch(err => {
			console.log(err);
		})
	}, 5000);
}

document.onpaste = function(e) {
	let pastedText = '';
	if (window.clipboardData && window.clipboardData.getData) { // IE
		pastedText = window.clipboardData.getData('Text');
	} else if (e.clipboardData && e.clipboardData.getData) {
		pastedText = e.clipboardData.getData('text/plain');
	}
	if (pastedText.match(/[A-Z]{3}-[0-9]{3}\s+Cosmic\s(?:Anomaly|Signature)\s+/g)) {
		newPScan(pastedText, document.title);
	} else if (pastedText.match(/[0-9]+\s[a-zA-Z\s-]+/g)) {
		newCScan(pastedText);
	} else {
		newZKill(pastedText);
	}
	return false; // Prevent the default handler from running.
};

document.onkeyup = keys;

function keys() {
	if (event.ctrlKey && event.keyCode == 90) { // Ctrl + Z
		ctrlZ(document.title);
	}
	if (event.keyCode == 32) { // Space
		let tracking = localStorage.getItem('tracking');
		if (tracking == null || tracking == 'enabled') {
			tracking = 'disabled';
			localStorage.setItem('tracking', tracking);
		} else {
			tracking = 'enabled';
			localStorage.setItem('tracking', tracking);
		}
		displayTrackingPopUp(tracking);
	}
	if (event.keyCode == 8) { // Backspace
		let system = JSON.parse(localStorage.getItem('system'));
		goTo(system.region + '.html?sys=' + system.id);
	}
	if (event.keyCode == 27) { // Escape
		let iframe = document.getElementById('iframe') || window.parent.document.getElementById('iframe');
		while (iframe.firstChild) {
			iframe.removeChild(iframe.firstChild);
		}
	}
}

function changeSystem() {
	let system = JSON.parse(localStorage.getItem('system'));
	document.title = system.name;
	let systemName = document.getElementById('systemName')
	systemName.innerHTML = system.name;
	systemName.onclick = function() {
		goTo(system.region + '.html?sys=' + system.id);
	};
	history.pushState({}, system.name, '/system.html?location=' + system.region + '/' + system.name + '/' + system.id);
	checkResults(system.name);
}

function displayTrackingPopUp(tracking) {
	let body = document.body;
	let Tracking = document.getElementById('Tracking');
	body.removeChild(Tracking);
	Tracking = document.createElement('div');
	Tracking.id = 'Tracking';
	let TrackingText = document.createElement('p');
	TrackingText.id = 'TrackingText';
	Tracking.appendChild(TrackingText);
	body.appendChild(Tracking);
	TrackingText.innerHTML = 'Tracking ' + tracking;
	Tracking.style.MozAnimationName = 'TrackingPopUp';
	Tracking.style.MozAnimationDuration = '2s';
	Tracking.style.OAnimationName = 'TrackingPopUp';
	Tracking.style.OAnimationDuration = '2s';
	Tracking.style.WebkitAnimationName = 'TrackingPopUp';
	Tracking.style.WebkitAnimationDuration = '2s';
}

function ctrlZ(system) {
	signatures = JSON.parse(localStorage.getItem("backup_" + system));
	if (signatures !== "undefined") {
		displaySignatures(system);
		localStorage.setItem("backup_" + system, localStorage.getItem("cache_" + system));
		localStorage.setItem("cache_" + system, JSON.stringify(signatures));
	}
}

function saveCache(system) {
	for (let sigId in signatures) {
		delete signatures[sigId].isNew;
	}
	localStorage.setItem("cache_" + system, JSON.stringify(signatures));
}

function makeCombat(sigId, system) {
	let field = document.getElementById(sigId + "_type");
	field.innerHTML = "Combat";
	signatures[sigId].type = "Combat";
	saveCache(system);
}

function checkResults(system) {
	signatures = JSON.parse(localStorage.getItem("cache_" + system));
	if (signatures == null) signatures = {};
	displaySignatures(system);
}

function newPScan(input, system) {
	signatures = {};
	// fill in results
	localStorage.setItem("backup_" + system, localStorage.getItem("cache_" + system));
	parseSignatures(input, system);
}

function newCScan(input) {
	let lines = input.split('\n');
	let raw = '';
	for (let i = 0 ; i < lines.length ; ++i) {
		raw += lines[i].replace(' ', '+') + '%0A';
	}
	let data = {
		'url': 'https://evepraisal.com/appraisal.json?market=jita&raw_textarea=' + raw + '&persist=no'
	}
	let url = 'https://evescanner-gatekeeper.herokuapp.com/evepraisal';
	httpRequest('POST', url, false, JSON.stringify(data), {'Content-Type': 'application/json'})
	.then(response => {
		let iframe = document.getElementById('iframe');
		while (iframe.firstChild) {
			iframe.removeChild(iframe.firstChild);
		}
		let CScanResults = document.createElement('iframe');
		CScanResults.style.width = '100%';
		CScanResults.style.height = '100%';
		iframe.appendChild(CScanResults);
		let d = (CScanResults.contentWindow || CScanResults.contentDocument);
		if (d.document) d = d.document;
		d.open();
		let result = JSON.parse(response);
		d.write(response.appraisal.totals.toString());
		d.onkeyup = window.parent.keys;
		d.close();
		iframe.style.display = 'inline-block';
	})
	.catch(err => {
		console.log(err);
	})
}

function newZKill(input) {
	let iframe = document.getElementById('iframe');
	while (iframe.firstChild) {
		iframe.removeChild(iframe.firstChild);
	}
	let zKillboard = document.createElement('iframe');
	zKillboard.style.width = '100%';
	zKillboard.style.height = '100%';
	zKillboard.sandbox = 'allow-same-origin';
	iframe.appendChild(zKillboard);
	let d = (zKillboard.contentWindow || zKillboard.contentDocument);
	if (d.document) d = d.document;
	d.open();
	d.onkeyup = window.parent.keys;
	d.close();
	iframe.style.display = 'inline-block';
	zKillboard.src = 'https://zkillboard.com/search/' + input + '/';
}

function displaySignatures(system) {
	let resultsTab = document.getElementById("PScanResults");
	resultsTab.innerHTML = "";
	for (let i = 0 ; i < Object.keys(signatures).length ; ++i) {
		let tr = document.createElement("tr");
		let sigId = Object.keys(signatures)[i];
		tr.id = sigId;
		if (signatures[sigId].isNew == 1) {
			tr.style.background = "rgba(50, 150, 50, 0.5)";
			signatures[sigId].isNew = 0;
		}
		let tmp = document.createElement("td");
		tmp.className = "sigId";
		tmp.innerHTML = sigId;
		tr.appendChild(tmp);
		if (signatures[sigId].type == "???") {
			tmp = document.createElement("td");
			tmp.className = "isCombat";
			let combat = document.createElement("button");
			combat.style.background = "url(\"../resources/images/combat.png\") top no-repeat";
			combat.setAttribute("sigId", sigId);
			combat.onclick = function() {
				makeCombat(this.getAttribute("sigId"), system);
			};
			tmp.appendChild(combat);
			tr.appendChild(tmp);
		}
		tmp = document.createElement("td");
		tmp.id = sigId + "_type";
		tmp.className = "sigType";
		tmp.innerHTML = signatures[sigId].type;
		tr.appendChild(tmp);
		tmp = document.createElement("td");
		tmp.id = sigId + "_name";
		tmp.className = "sigName";
		tmp.innerHTML = signatures[sigId].name;
		tr.appendChild(tmp);
		resultsTab.appendChild(tr);
	}
}

function parseSignatures(results, system) {
	let resultsTab = document.getElementById("PScanResults");
	cache = JSON.parse(localStorage.getItem("cache_" + system));
	if (results == null) {
		return true;
	}
	let lines = results.split('\n');
	let j = 0;
	for (let i = 0 ; i < lines.length ; ++i) {
		if (lines[i].indexOf("Anomaly") == -1) {
			parseLineToCache(lines[i]);
			++j;
		}
	}
	displaySignatures(system);
	saveCache(system);
}

/// Parse a result line pasted in the reader and stores it in JSON in the cache
function parseLineToCache(line) {
	let words = line.split(/[\t\s]+/);
	let sigId = words[0];
	if (sigId == "") {
		return;
	}
	
	if ((cache != null) && (typeof(cache[sigId]) != "undefined")) {
		signatures[sigId] = cache[sigId];
		signatures[sigId]['isNew'] = 0;
	}
	else {
		signatures[sigId] = {};
		signatures[sigId]['isNew'] = 1;
		if (words[3].indexOf("%") !== -1) {
			signatures[sigId]['type'] = "???";
			signatures[sigId]['name'] = "Unknown";
		}
	}
	if (words[3].indexOf("%") == -1) {
		signatures[sigId]['type'] = words[3];
		if ((typeof(signatures[sigId]['name']) == "undefined") || (signatures[sigId]['name'] == "Unknown")) {
			let i = 5;
			if (words[i].indexOf("%") !== -1 ) {
				signatures[sigId]['name'] = "Unknown";
			}
			else {
				if (words[3] == "Wormhole") {
					signatures[sigId]['name'] = "Wormhole";
					--i;
				}
				else {
					signatures[sigId]['name'] = words[i++];
					while ((words[i]) && (words[i].indexOf("%") == -1)) {
						signatures[sigId]['name'] += " " + words[i];
						++i;
					}
				}
			}
		}
	}
}
