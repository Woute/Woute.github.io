'use strict';

function setDestination(id) {  
    let characterID = localStorage.getItem('characterID');
    let address = 'https://crest-tq.eveonline.com/characters/' + characterID.toString() + '/ui/autopilot/waypoints/';
	let data = {
		'clearOtherWaypoints': false,
		'first': false,
		'solarSystem': {
			'href': 'https://crest-tq.eveonline.com/solarsystems/' + id.toString() + '/',
			'id': id
		}
	}
	let headers = {
		'Authorization': 'Bearer ' + localStorage.getItem('token')
	}
	httpRequest('POST', address, true, JSON.stringify(data))
	.then(response => {
		console.log(response);
	})
	.catch(err => {
		console.log(err);
	})
}
