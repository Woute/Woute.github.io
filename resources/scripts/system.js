'use strict';
let cache = {};
let signatures = {};
let tracking = true;

document.onkeyup = function(e) {
	if (e.ctrlKey && e.keyCode == 90) {
		ctrlZ(document.title);
	}
	if (e.keyCode == 32) {
		tracking = !tracking;
		displayTrackingPopUp(tracking);
	}
	if (e.keyCode == 8) {
		goTo('index');
	}
}

function displayTrackingPopUp(enabled) {
	var Tracking = document.getElementById('Tracking');
	var TrackingText = document.getElementById('TrackingText');
	if (enabled) {
		TrackingText.innerHTML = 'Tracking enabled';
	} else {
		TrackingText.innerHTML = 'Tracking disabled'
	}
	Tracking.style.MozAnimationName = 'TrackingPopUp';
	Tracking.style.MozAnimationDuration = '8s';
	Tracking.style.OAnimationName = 'TrackingPopUp';
	Tracking.style.OAnimationDuration = '8s';
	Tracking.style.WebkitAnimationName = 'TrackingPopUp';
	Tracking.style.WebkitAnimationDuration = '8s';
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
	for (sigId in signatures) {
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
	if (signatures !== "undefined" && signatures !== null) {
		displaySignatures(system);
	}
}

function checkEnter(system) {
	let key = window.event.keyCode;
	signatures = {};
	if (key == 13) {
		// fill in results
		if (typeof(Storage) != "undefined") {
			let reader = document.getElementById("reader");
			localStorage.setItem("backup_" + system, localStorage.getItem("cache_" + system));
			parseSignatures(reader.value, system);
		}
	}
	else {
		return true;
	}
}

function displaySignatures(system) {
	let resultsTab = document.getElementById("results");
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
			tmp.className = "combat";
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
		tmp.className = "type";
		tmp.innerHTML = signatures[sigId].type;
		tr.appendChild(tmp);
		tmp = document.createElement("td");
		tmp.id = sigId + "_name";
		tmp.className = "name";
		tmp.innerHTML = signatures[sigId].name;
		tr.appendChild(tmp);
		resultsTab.appendChild(tr);
	}
}

function parseSignatures(results, system) {
	let resultsTab = document.getElementById("results");
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
