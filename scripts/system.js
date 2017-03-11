var cache = {};
var signatures = {};

window.onload = setInterval(function() {
	
}, 5000);

function ctrlZ(system) {
	signatures = JSON.parse(localStorage.getItem("backup_" + system));
	if (signatures !== "undefined") {
		displaySignatures(system);
		localStorage.setItem("backup_" + system, localStorage.getItem("cache_" + system));
		localStorage.setItem("cache_" + system, JSON.stringify(signatures));
	}
}

function saveCache(system) {
	console.log(signatures);
	for (sig in signatures) {
		delete signatures[sig].isNew;
	}
	localStorage.setItem("cache_" + system, JSON.stringify(signatures));
}

function makeCombat(sigId, system) {
	var field = document.getElementById(sigId + "_type");
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
	var key = window.event.keyCode;
	signatures = {};
	if (key == 13) {
		// fill in results
		if (typeof(Storage) != "undefined") {
			var reader = document.getElementById("reader");
			localStorage.setItem("backup_" + system, localStorage.getItem("cache_" + system));
			parseSignatures(reader.value, system);
		}
	}
	else {
		return true;
	}
}

function displaySignatures(system) {
	var resultsTab = document.getElementById("results");
	resultsTab.innerHTML = "";
	for (var i = 0 ; i < Object.keys(signatures).length ; ++i) {
		var tr = document.createElement("tr");
		var sigId = Object.keys(signatures)[i];
		tr.id = sigId;
		if (signatures[sigId].isNew == 1) {
			tr.style.background = "rgba(50, 150, 50, 0.5)";
			signatures[sigId].isNew = 0;
		}
		var tmp = document.createElement("td");
		tmp.className = "sigId";
		tmp.innerHTML = sigId;
		tr.appendChild(tmp);
		if (signatures[sigId].type == "???") {
			tmp = document.createElement("td");
			tmp.className = "combat";
			var combat = document.createElement("button");
			combat.style.background = "url(\"../images/combat.png\") top no-repeat";
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
	var resultsTab = document.getElementById("results");
	cache = JSON.parse(localStorage.getItem("cache_" + system));
	if (results == null) {
		return true;
	}
	var lines = results.split('\n');
	var j = 0;
	for (var i = 0 ; i < lines.length ; ++i) {
		if (lines[i].indexOf("Anomaly") == -1) {
			parseLineToCache(lines[i]);
			++j;
		}
		else if (lines[i].match(/Covert/i)) {
			var GhostSite = document.getElementById("GhostSite");
			GhostSite.style.MozAnimationName = "GhostSitePopUp";
			GhostSite.style.MozAnimationDuration = "8s";
			GhostSite.style.OAnimationName = "GhostSitePopUp";
			GhostSite.style.OAnimationDuration = "8s";
			GhostSite.style.WebkitAnimationName = "GhostSitePopUp";
			GhostSite.style.WebkitAnimationDuration = "8s";
		}
	}
	displaySignatures(system);
	saveCache(system);
}

/// Parse a result line pasted in the reader and stores it in JSON in the cache
function parseLineToCache(line) {
	var words = line.split(/[\t\s]+/);
	var sigId = words[0];
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
			var i = 5;
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
