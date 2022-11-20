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
	} else if (e.code == "ArrowUp" && selectMode) { // Arrow Up
		e.preventDefault();
		selectParentComponent();
    } else if (e.code == "ArrowDown" && selectMode) { // Arrow Down
		e.preventDefault();
		selectChildComponent();
    } else if (e.code == "ArrowLeft" && selectMode) { // Arrow Left
		e.preventDefault();
		selectPreviousSiblingComponent();
    } else if (e.code == "ArrowRight" && selectMode) { // Arrow Right
		e.preventDefault();
		selectNextSiblingComponent();
    } else if (e.code == "Escape" && selectMode) { // Escape
		e.preventDefault();
		stopSelectMode();
	} else if (e.code == "Enter") { // Enter
		validateSelection();
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
 * Add a border to the current component selected
 */
function addBorderToCurrentComponent() {
	removeAllBorder();
	console.log(currentComponent);
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