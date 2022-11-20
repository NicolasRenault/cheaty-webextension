let selectMode = false;

console.log("Cheaty extention working here");

document.onkeydown = (e) => { 
	if (e.ctrlKey && e.altKey && e.key == "n" && !selectMode) { //Ctr + Alt + N
		selectComponent();
	} else if (e.code == "ArrowUp" && selectMode) {
		e.preventDefault();
		alert("Up");
    } else if (e.code == "ArrowDown" && selectMode) {
		e.preventDefault();
		alert("Down");
    } else if (e.code == "Escape" && selectMode) {
		e.preventDefault();
		stopSelectComponent();
	}
};

function selectComponent() {
	selectMode = true;
	console.log("Select mode on");
}

function stopSelectComponent() {
	selectMode = false;
	console.log("Select mode off");
}