'use strict';

function setDestination(e, id) {  
    let characterID = localStorage.getItem('characterID');
    let clearOtherWaypoints = false;
    let first = false;
    if (e.shiftKey) {
		first = true;
	}
	if (e.ctrlKey) {
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
	let href = window.location.href;
	href = href.substring(0, href.indexOf('?'));
	history.pushState({}, document.title, href);
}
