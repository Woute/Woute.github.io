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
