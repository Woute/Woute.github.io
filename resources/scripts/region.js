'use strict';


function setDestination(sysId) {  
    let characterID = localStorage.getItem('characterID');
    let clearOtherWaypoints = false;
    let addToBeginning = false;
    let apiVersion = 'latest';
    let baseURI = 'https://esi.evetech.net/'
    if (event.shiftKey) {
		first = true;
	}
	if (event.ctrlKey) {
		clearOtherWaypoints = true;
	}
    let address = baseURI + apiVersion + '/characters/ui/autopilot/waypoint/';
	let data = {
		'clear_other_waypoints ': clearOtherWaypoints,
		'add_to_beginning': addToBeginning,
		'destination_id': sysId
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

function selectShow() {
	let selection = document.getElementById('selectShow').value;
	if (selection == 'Jumps') {
		showJumps();
	} else if (selection == 'Kills') {
		showKills();
	}
}

function showJumps() {
	let texts = document.getElementsByClassName('st');
	httpRequest('GET', 'https://esi.evetech.net/latest/universe/system_jumps/')
	.then(response => {
		for (let i = 1 ; i < texts.length ; ++i) {
			let sysId = texts[i].id.substring(3);
			let result = JSON.parse(response);
			let system = result.find(obj => {
				return obj.system_id === sysId
			})
			let jumps = '0'
			if (system != undefined) jumps = system.ship_jumps;
			texts[i].innerHTML = jumps;
			texts[i].classList.remove('so');
			let color = '#000000';
			switch (true) {
				case (jumps < 20):
					color = '#000000';
					break;
				case (jumps < 50):
					color = '#006600';
					break;
				case (jumps < 80):
					color = '#669933';
					break;
				case (jumps < 120):
					color = '#999900';
					break;
				case (jumps < 200):
					color = '#CC9900';
					break;
				default:
					color = '#990000';
					break;
			}
			let rect = document.querySelector('#rect' + sysId);
			rect.style.fill = color;
		}
	})
	.catch(err => {
		console.log(err);
	})
}

function showKills() {
	let texts = document.getElementsByClassName('st');
	httpRequest('GET', 'https://esi.evetech.net/latest/universe/system_kills/')
	.then(response => {
		for (let i = 1 ; i < texts.length ; ++i) {
			let sysId = texts[i].id.substring(3);
			let result = JSON.parse(response);
			let system = result.find(obj => {
				return obj.system_id === sysId
			})
			let shipKills = '0';
			let podKills = '0';
			let npcKills = '0';
			if (system != undefined) {
				shipKills = system.ship_kills;
				podKills = system.pod_kills;
				npcKills = system.npc_kill;
			}
			texts[i].innerHTML = shipKills + ' / ' + podKills + ' (' + npcKills + ')';
			texts[i].classList.remove('so');
			let color = '#000000';
			switch (true) {
				case (shipKills < 5):
					color = '#000000';
					break;
				case (shipKills < 10):
					color = '#006600';
					break;
				case (shipKills < 20):
					color = '#669933';
					break;
				case (shipKills < 50):
					color = '#999900';
					break;
				case (shipKills < 100):
					color = '#CC9900';
					break;
				default:
					color = '#990000';
					break;
			}
			let rect = document.querySelector('#rect' + sysId);
			rect.style.fill = color;
		}
	})
	.catch(err => {
		console.log(err);
	})
}
