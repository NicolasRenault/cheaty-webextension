const CSS_CLASS_NAME = "cheaty-selected";

let selectMode = false;
let actionMode = false;
let currentComponent = null;
let listOfSelected = null;

console.log("Cheaty extention working here");

document.onkeydown = (e) => {
	// console.log(e.key + " " + e.code);
	e.preventDefault(); //TODO check if not blocking all the shortcut in the page. Add verification with selectMode and actionMode

	if (e.ctrlKey && e.altKey && e.key == "n") { //Ctr + Alt + N
		if (selectMode || actionMode) {
			stopSelectMode();
		} else {
			init();
		}
	} else if (e.code == "ArrowUp" && selectMode) { // Arrow Up
		selectParentComponent();
    } else if (e.code == "ArrowDown" && selectMode) { // Arrow Down
		selectChildComponent();
    } else if (e.code == "ArrowLeft" && selectMode) { // Arrow Left
		selectPreviousSiblingComponent();
    } else if (e.code == "ArrowRight" && selectMode) { // Arrow Right
		selectNextSiblingComponent();
    } else if (e.code == "Escape" && (selectMode || actionMode)) { // Escape
		if (!actionMode) {
			stop();
		} else {
			stopActionMode();
		}
	} else if (e.code == "Enter" && selectMode) { // Enter
		if (!actionMode) {
			initActionMode();
		}
	}
};

document.onmousemove = (e) => {
	if(selectMode && !actionMode) {
		selectComponent();
	}
}

/**
 * Init the process
 */
function init() {
	selectMode = false;
	actionMode = false;
	selectComponent();
	initSelectionMode();
}

/**
 * Stop all the process
 */
function stop() {
	selectMode = false;
	actionMode = false;
	removeAllBorder();
}

/**
 * Init the selection mode
 */
function initSelectionMode() {
	console.log("Cheaty: Select mode on");
	selectMode = true;
}

/**
 * Stop the selection mode
 */
function stopSelectionMode() {
	console.log("Cheaty: Select mode off");
	selectMode = false;
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
		stop();
		return -1;
	}

	if (currentComponent == hovers.item(hovers.length - 1)) return;

	currentComponent = hovers.item(hovers.length - 1);

	addBorderToCurrentComponent();
}

/**
 * Select the parent of the current component
 */
function selectParentComponent() {
	if (currentComponent == null || currentComponent.parentNode == null) return;
	currentComponent = currentComponent.parentNode;
	addBorderToCurrentComponent();
}

/**
 * Select the child of the current component
 */
function selectChildComponent() {
	if (currentComponent == null || currentComponent.firstChild == null) return;
	currentComponent = currentComponent.firstChild;
	addBorderToCurrentComponent();
}

/**
 * Select the previous sibling of the current component
 */
function selectPreviousSiblingComponent() {
	if (currentComponent == null || currentComponent.previousSibling == null) return;
	currentComponent = currentComponent.previousSibling;
	addBorderToCurrentComponent();
} 

/**
 * Select the next sibling of the current component
 */
function selectNextSiblingComponent() {
	if (currentComponent == null || currentComponent.nextSibling == null) return;
	currentComponent = currentComponent.nextSibling;
	addBorderToCurrentComponent();
}

/**
 * Validate the current component, stop the selection mode and init action mode
 */
function initActionMode() {
	stopSelectionMode();
	actionMode = true;
	console.log("Cheaty: Selection validated")
	console.log(currentComponent);
}

/**
 * Stop the action mode and start the selection mode
 */
function stopActionMode() {
	actionMode = false;
	initSelectionMode();
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
