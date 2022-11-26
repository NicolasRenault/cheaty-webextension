const CSS_CLASS_NAME = "cheaty-selected";
const ACTION_BUTTON_CONTAINER_ID = "cheaty_action_button_container";
const HIDE_BUTTON_ID = "cheaty_hide_button";
const PASSWORD_BUTTON_ID = "cheaty_password_button";
const PASSWORD_CLASS = "cheaty_input";
const COPY_BUTTON_ID = "cheaty_copy_button";
const ACTION_BUTTON_CONATINER_WIDTH_SMALL = 150;
const ACTION_BUTTON_CONATINER_WIDTH_BIG = 250;
const ACTION_BUTTON_CONATINER_HEIGHT = 48;

let selectMode = false;
let actionMode = false;
let currentComponent = null;
let listOfSelected = null;

console.log("Cheaty extention working here");

document.onkeydown = (e) => {
	// console.log(e.key + " " + e.code);

	if (selectMode || actionMode) {
		e.preventDefault();
	}

	if (e.ctrlKey && e.altKey && e.key == "n") { //Ctr + Alt + N
		if (selectMode) {
			stop();
		} else if (actionMode) {
			stopActionMode();
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

document.onclick = (e) => {
	if(selectMode || actionMode) {
		e.preventDefault();
		if (!actionMode) initActionMode();
	}
}

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
 * Validate the current component, stop the selection mode and init action mode
 */
function initActionMode() {
	stopSelectionMode();
	actionMode = true;
	initActionMenu();
}

/**
 * Stop the action mode and start the selection mode
 */
function stopActionMode() {
	actionMode = false;
	removeActionMenu();
	initSelectionMode();
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
		console.error("Something is wrong with the selection of a component with the mouse");
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

/**
 * Init and place next to the current component the action menu
 */
function initActionMenu() {
	console.log("initActionMode");
	let actionButton = genrateActionButton();
	actionButton = setPositionFromCurrentComponent(actionButton);

	document.body.appendChild(actionButton);
}

/**
 * Remove the action menu from the page
 */
function removeActionMenu() {
	document.getElementById(ACTION_BUTTON_CONTAINER_ID).remove();
}

/**
 * Generate the action button menu
 * 
 * @return HTMLDivElement 
 */
function genrateActionButton() {
	let actionButtonContainer = document.createElement("div");
	actionButtonContainer.id = ACTION_BUTTON_CONTAINER_ID;

	let hideButton = document.createElement("button");
	hideButton.id = HIDE_BUTTON_ID;

	if (currentComponent.style.display == "none") {
		hideButton.title = "Show the selected element";
		hideButton.innerHTML = "Show";
	} else {
		hideButton.title = "Hide the selected element";
		hideButton.innerHTML = "Hide";
	}

	hideButton.addEventListener('click', hideCurrentComponent);
	actionButtonContainer.appendChild(hideButton);

	// let span = document.createElement("span");
	// actionButtonContainer.appendChild(span);

	if (currentComponent.tagName == 'INPUT') {
		let passwordButton = document.createElement("button");
		passwordButton.id = PASSWORD_BUTTON_ID;

		if (currentComponent.type == "password") {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerHTML = "Show password";
		} else {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerHTML = "Hide password";
		}
		passwordButton.addEventListener('click', changePasswordTypeCurrentComponent);
		actionButtonContainer.appendChild(passwordButton);
		actionButtonContainer.classList.add(PASSWORD_CLASS);
	}

	let copyButton = document.createElement("button");
	copyButton.id = COPY_BUTTON_ID;
	copyButton.title = "Copy the selected element";
	copyButton.innerHTML = "Copy";
	copyButton.addEventListener('click', copyCurrentComponent);
	actionButtonContainer.appendChild(copyButton);

	return actionButtonContainer;
}

/**
 * Set the top and left value of the element in parameter from the current coponent positions
 * 
 * @param {HTMLDivElement} elm 
 * @returns HTMLDivElement
 */
function setPositionFromCurrentComponent(elm) {
	let rect = currentComponent.getBoundingClientRect();

	elm.style.left = ((rect.right - (rect.width / 2)) + window.scrollX - ((((currentComponent.tagName == 'INPUT') ? ACTION_BUTTON_CONATINER_WIDTH_BIG : ACTION_BUTTON_CONATINER_WIDTH_SMALL)) / 2)) + "px";

	if ((rect.top - ACTION_BUTTON_CONATINER_HEIGHT) > 0) {
		elm.style.top = (rect.top + window.scrollY - ACTION_BUTTON_CONATINER_HEIGHT) + "px";
	} else {
		elm.style.top = (rect.top + window.scrollY + rect.height + 8) + "px";
		elm.classList.add("bottom");
	}

	return elm;
}

/**
 * Update the action menu button by action
 * @param {string} action
 */
function updateActionButtonsState(action) {
	if (action === "hide") {
		if (currentComponent.style.display == "none") {
			document.getElementById(HIDE_BUTTON_ID).innerHTML = "Show";
		} else {
			document.getElementById(HIDE_BUTTON_ID).innerHTML = "Hide";
		}
	} else if (action === "password") {
		if (currentComponent.type == "password") {
			document.getElementById(PASSWORD_BUTTON_ID).innerHTML = "Show password";
		} else {
			document.getElementById(PASSWORD_BUTTON_ID).innerHTML = "Hide password";
		}
	} else if (action === "copy") {
		document.getElementById(COPY_BUTTON_ID).innerHTML = "Copied";
	}
}

/**
 * Hide/show the current component by setting the style display to none/block
 */
function hideCurrentComponent() {
	if (currentComponent.style.display == "none") {
		currentComponent.style.display = "block";
	} else {
		currentComponent.style.display = "none";
	}

	updateActionButtonsState("hide");
}

/**
 * Hide/show the text password for the current component by setting the input type to password/text
 */
function changePasswordTypeCurrentComponent() {
	if (currentComponent.type == "password") {
		currentComponent.type = "text";
	} else {
		currentComponent.type = "password";
	}

	updateActionButtonsState("password");
}

/**
 * Copy the current component to the clipboard
 */
function copyCurrentComponent() {
	try {
		//Copy to the clipboard
		navigator.clipboard
			.writeText(currentComponent.outerHTML)
			.then(() => {
				console.log("HTML Component copied to clipboard");
			})
			.catch((err) => {
				throw new Error(err);
			});

		updateActionButtonsState("copy");

	} catch (err) {
		console.error("Something went wrong", err);
	}
}