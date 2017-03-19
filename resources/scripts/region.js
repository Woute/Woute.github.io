'use strict';

function setDestination(id) {  
    let characterID = localStorage.getItem('characterID');
    let clearOtherWaypoints = false;
    let first = false;
    if (event.shiftKey) {
		first = true;
	}
	if (event.ctrlKey) {
		clearOtherWaypoints = true;
	}
    let address = 'https://crest-tq.eveonline.com/characters/' + characterID.toString() + '/ui/autopilot/waypoints/';
	let data = {
		'clearOtherWaypoints': clearOtherWaypoints,
		'first': first,
		'solarSystem': {
			'href': 'https://crest-tq.eveonline.com/solarsystems/' + id.toString() + '/',
			'id': id
		}
	}
	httpRequest('POST', address, true, JSON.stringify(data))
	.catch(err => {
		console.log(err);
	})
}

function highlightSystem(sysId) {
	let sys = document.getElementById('rect' + sysId);
	sys.style.stroke = '#FFFFFF';
	sys.style.strokeWidth = '3';
}

function showJumps() {
	let texts = document.getElementsByClassName('st');
	httpRequest('GET', 'https://api.eveonline.com/map/Jumps.xml.aspx')
	.then(response => {
		for (let i = 0 ; i < texts.length ; ++i) {
			let sysId = texts[i].id.substring(3);
			let regex = new RegExp('<row solarSystemID="' + sysId + '" shipJumps="(\d+)"/>');
			texts[i].innerHTML = regex.exec(response)[1] || '0';
		}
	})
	.catch(err => {
		console.log(err);
	})
}
