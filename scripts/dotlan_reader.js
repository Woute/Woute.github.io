var correspondances = {};

function compute() {
	/// Reads the user input line by line and convert it to a JavaScript Object
    var option = document.getElementById('option').value;
	var input = document.getElementById('dotlanReader').value;
	var lines = input.split('<symbol id="def');
    var nameRegex = /.*<a xlink:href="http:\/\/evemaps.dotlan.net\/map\/([^"]+).*/
    var nameRegex2 = /.*<a xlink:href="http:\/\/evemaps.dotlan.net\/system\/([^"]+).*/
    for (var i = 1 ; i < lines.length - 1 ; i++) {
        var id = lines[i].substr(0, lines[i].indexOf('"'));
        if (nameRegex.test(lines[i])) {
            correspondances[id] = '/' + nameRegex.exec(lines[i])[1];
        } else if (nameRegex2.test(lines[i])) {
            correspondances[id] = nameRegex2.exec(lines[i])[1];
        }
    }
    for (var id in correspondances) {
        var replacement = '';
        if (option == 'Universe') {
            replacement = 'xlink:href="#def' + id + '" onclick="goTo(\'' + correspondances[id] + '/index\');" />'
        } else if (option == 'Region') {
            replacement = 'xlink:href="#def' + id + '" onclick="goTo(\'' + correspondances[id] + '\');" oncontextmenu="setDestination(' + id + '); return false;" />'
        }
        input = input.replace(new RegExp('xlink:href="#def' + id + '" />'), replacement);
    }
    input = input.replace(/<g id="controls"[.\s\S]*\]\]><\/script>/m, '');
    input = input.replace(/onload="init\(evt\)"[^>]*>/, '>');
    input += '\n</html>';
    document.getElementById('result').value = input;
}
