const CSS_CLASS_NAME = "cheaty-selected";

let selectMode = false;
let actionMode = false;
let currentComponent = null;
let listOfSelected = null;

console.log("Cheaty extention working here");

document.onkeydown = (e) => {
	// console.log(e.key + " " + e.code);

	if (e.ctrlKey && e.altKey && e.key == "n") { //Ctr + Alt + N
		if (selectMode) {
			stopSelectMode();
		} else {
			initSelectMode();
		}
	} else if (e.code == "ArrowUp" && selectMode) { // ArrowUp
		e.preventDefault();
		selectParentComponent();
    } else if (e.code == "ArrowDown" && selectMode) { // ArrowDown
		e.preventDefault();
		selectChildComponent();
    } else if (e.code == "Escape" && selectMode) { // Escape
		e.preventDefault();
		stopSelectMode();
	} else if (e.code == "Enter") { // Enter
	}
};

document.onmousemove = (e) => {
	if(selectMode && !actionMode) {
		selectComponent();
	}
}

/**
 * Init the selection of a component
 */
function initSelectMode() {
	selectMode = true;
	console.log("Cheaty: Select mode on");
	selectComponent();
}

/**
 * Stop the selection of a component
 */
function stopSelectMode() {
	selectMode = false;
	console.log("Cheaty: Select mode off");
}

/**
 * Select the component under the mouse
 * 
 * @see currentComponent
 * @returns -1 on error 
 */
function selectComponent() {
	let hovers = document.querySelectorAll(":hover");

	if (hovers.length == 0) {
		console.log("Something is wrong with the selection of a component with the mouse");
		stopSelectMode();
		return -1;
	}

	if (currentComponent == hovers.item(hovers.length - 1)) return;

	currentComponent = hovers.item(hovers.length - 1);

	addBorderToCurrentComponent();
}

/**
 * Add a border to the current component selected
 */
function addBorderToCurrentComponent() {
	removeAllBorder();
	currentComponent.classList.add(CSS_CLASS_NAME);
}

/**
 * Remove all the border displayed in the page
 */
function removeAllBorder() {
	document.querySelectorAll("." + CSS_CLASS_NAME).forEach((item) => {
		item.classList.remove(CSS_CLASS_NAME);
	});
}