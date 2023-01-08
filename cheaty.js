const CSS_CLASS_NAME_SELECTION = "cheaty-selection";
const CSS_CLASS_NAME_SELECTED = "cheaty-selected";
const ACTION_BUTTON_CONTAINER_ID = "cheaty_action_button_container";
const HIDE_BUTTON_ID = "cheaty_hide_button";
const PASSWORD_BUTTON_ID = "cheaty_password_button";
const PASSWORD_CLASS = "cheaty_input";
const COPY_BUTTON_ID = "cheaty_copy_button";
const ACTION_BUTTON_CONATINER_WIDTH_SMALL = 150;
const ACTION_BUTTON_CONATINER_WIDTH_BIG = 250;
const ACTION_BUTTON_CONATINER_HEIGHT = 48;
const INPUT_TEXT_LIST = ["text", "email", "password", "search", "tel", "url"];
const GLOBAL_CSS_VARIABLES = [
	"--cheaty-primary-color:27, 38, 59",
	"--cheaty-secondary-color:65, 90, 119",
	"--cheaty-termary-color:13, 27, 42",
	"--cheaty-text-color:224, 225, 221",
	"--cheaty-cursor-pen-url:[url]",
];

let selectMode = false;
let globalIndex = 0;
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

try {
	chrome.runtime.onMessage.addListener((message) => {
		if (message.command === "cheaty_get_data") {
			sendDataToPopup();
		} else if (message.command === "cheaty_reverse") {
			revertActionOnComponent(message.componentId, message.action);
		}
	});
} catch (error) {
	console.error(error);
}

onresize = (e) => {
	if (actionMode) {
		moveActionMenu();
	}
};

// ? Since in chrome and chromium browser the code: @import url("./global.css"); doesn't work, here is a fix
// ? If you have any idea how to fix this issue please feel free to add an issue here: https://github.com/NicolasRenault/cheaty-webextention/issues/new
initCSS();
/**
 * Insert custom CSS variables to the page
 */
function initCSS() { 
	let penUrl = "url(" + chrome.runtime.getURL("icons/cursor_32x32.png") + ")";

	GLOBAL_CSS_VARIABLES.forEach((variable) => {
		variable = variable.split(":");

		if (variable[1] === "[url]") variable[1] = penUrl;

		document.documentElement.style.setProperty(variable[0], variable[1]);
	})
}


/**
 * Init the process
 */
function init() {
	selectMode = false;
	actionMode = false;
	addSelectionClassToBody();
	selectComponent();
	initSelectionMode();
}

/**
 * Stop all the process
 */
function stop() {
	selectMode = false;
	actionMode = false;
	removeSelectionClass();
	removeAllBorder();
}

/**
 * Init the selection mode
 */
function initSelectionMode() {
	selectMode = true;
}

/**
 * Stop the selection mode
 */
function stopSelectionMode() {
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
	if (currentComponent == null || currentComponent.parentElement == null) return;
	currentComponent = currentComponent.parentElement;
	addBorderToCurrentComponent();
}

/**
 * Select the child of the current component
 */
function selectChildComponent() {
	if (currentComponent == null || currentComponent.firstElementChild == null) return;
	currentComponent = currentComponent.firstElementChild;
	addBorderToCurrentComponent();
}

/**
 * Select the previous sibling of the current component
 */
function selectPreviousSiblingComponent() {
	if (currentComponent == null || currentComponent.previousElementSibling == null) return;
	currentComponent = currentComponent.previousElementSibling;
	addBorderToCurrentComponent();
} 

/**
 * Select the next sibling of the current component
 */
function selectNextSiblingComponent() {
	if (currentComponent == null || currentComponent.nextElementSibling == null) return;
	currentComponent = currentComponent.nextElementSibling;
	addBorderToCurrentComponent();
}

/**
 * Add a class to the body 
 */
function addSelectionClassToBody() {
	document.body.classList.add(CSS_CLASS_NAME_SELECTION);
}

/**
 * Remove class from the body
 */
function removeSelectionClass() {
	document.body.classList.remove(CSS_CLASS_NAME_SELECTION);
}

/**
 * Add a border to the current component selected
 */
function addBorderToCurrentComponent() {
	removeAllBorder();
	currentComponent.classList.add(CSS_CLASS_NAME_SELECTED);
}

/**
 * Remove all the border displayed in the page
 */
function removeAllBorder() {
	document.querySelectorAll("." + CSS_CLASS_NAME_SELECTED).forEach((item) => {
		item.classList.remove(CSS_CLASS_NAME_SELECTED);
	});
}

/**
 * Init and place next to the current component the action menu
 */
function initActionMenu() {
	let actionButton = genrateActionButton();
	setPositionFromCurrentComponent(actionButton);

	document.body.appendChild(actionButton);
}

/**
 * Move the action menu
 */
function moveActionMenu() {
	let actionMenu = document.getElementById(ACTION_BUTTON_CONTAINER_ID);
	setPositionFromCurrentComponent(actionMenu);
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
 * @return HTMLElement 
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

	hideButton.addEventListener('click', changeDisplayCurrentComponent);
	actionButtonContainer.appendChild(hideButton);

	// let span = document.createElement("span");
	// actionButtonContainer.appendChild(span);

	if (currentComponent.tagName == 'INPUT' && INPUT_TEXT_LIST.includes(currentComponent.type)) {
		let passwordButton = document.createElement("button");
		passwordButton.id = PASSWORD_BUTTON_ID;

		if (currentComponent.type == "password") {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerHTML = "Show password";
		} else {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerHTML = "Hide as password";
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
 * Set the top and left value of the element in param from the current component positions
 * 
 * @param {HTMLElement} elm 
 */
function setPositionFromCurrentComponent(elm) {
	let rect = currentComponent.getBoundingClientRect();
	let style =  window.getComputedStyle(currentComponent, null);

	if (style.getPropertyValue("display") == "none") {
		elm.style.left = "1px";
		elm.style.top = "1px";
		elm.classList.add("hidden");

		return;
	} else {
		elm.classList.remove("hidden");
	}

	elm.style.left = ((rect.right - (rect.width / 2)) + window.scrollX - ((((currentComponent.tagName == 'INPUT') ? ACTION_BUTTON_CONATINER_WIDTH_BIG : ACTION_BUTTON_CONATINER_WIDTH_SMALL)) / 2)) + "px";

	if ((rect.top - ACTION_BUTTON_CONATINER_HEIGHT) > 0) {
		elm.style.top = (rect.top + window.scrollY - ACTION_BUTTON_CONATINER_HEIGHT) + "px";
	} else {
		if (rect.bottom + ACTION_BUTTON_CONATINER_HEIGHT > window.innerHeight) {
			elm.style.top = (rect.top + window.scrollY + 9) + "px";
		} else {
			elm.style.top = (rect.top + window.scrollY + rect.height + 8) + "px";
		}
		elm.classList.add("bottom");
	}
}

/**
 * Update the action menu button by action
 * 
 * @param {HTMLElement} component
 * @param {string} action
 */
function updateActionButtonsState(component, action) {
	if (document.getElementById(ACTION_BUTTON_CONTAINER_ID) != null) {
		if (action === "hide") {
			if (component.style.display == "none") {
				document.getElementById(HIDE_BUTTON_ID).innerHTML = "Show";
			} else {
				document.getElementById(HIDE_BUTTON_ID).innerHTML = "Hide";
			}
		} else if (action === "password") {
			if (component.type == "password") {
				document.getElementById(PASSWORD_BUTTON_ID).innerHTML = "Show password";
			} else {
				document.getElementById(PASSWORD_BUTTON_ID).innerHTML = "Hide as password";
			}
		} else if (action === "copy") {
			document.getElementById(COPY_BUTTON_ID).innerHTML = "Copied";
		}
	}
}

/**
 * Call the method hideComponent for the current component
 * 
 * @see changeDisplayComponent
 */
function changeDisplayCurrentComponent() {
	changeDisplayComponent(currentComponent)
}

/**
 * Hide/show the component in param by setting the style display to none/block
 * 
 * @param {HTMLElement} component
 */
function changeDisplayComponent(component) { //TODO Change the method name to changeDisplayComponent
	component.hidden = !component.hidden;
	let status = component.hidden ? "OFF" : "ON"; 

	addDataType(component, "hide", status);
	updateActionButtonsState(component, "hide");
}

/**
 * Call the method changePasswordTypeComponent for the current component
 * 
 * @see changePasswordTypeComponent
 */
function changePasswordTypeCurrentComponent() {
	changePasswordTypeComponent(currentComponent)
}

/**
 * Hide/show the text password for the component in param by setting the input type to password/text
 * 
 * @param {HTMLElement} component
 */
function changePasswordTypeComponent(component) {
	let status = undefined;
	
	if (component.dataset.cheaty_password_default === undefined) {
		component.dataset.cheaty_password_default = component.type;
	}

	if (component.type == "password") {
		if (component.dataset.cheaty_password_default === "password") {
			component.type = "text";
		} else {
			component.type = component.dataset.cheaty_password_default;
		}

		status = "ON";
	} else {
		component.type = "password";
		status = "OFF";
	}

	addDataType(component, "password", status);
	updateActionButtonsState(component, "password");
}

/**
 * Call the method copyComponent for the current component
 * 
 * @see copyComponent
 */
function copyCurrentComponent() {
	copyComponent(currentComponent);
}

/**
 * Copy the component to the clipboard
 * 
 * @param {HTMLElement} component
 */
function copyComponent(component) {
	try {
		//Copy to the clipboard
		navigator.clipboard
			.writeText(component.outerHTML)
			.then(() => {
				console.info("HTML Component copied to clipboard");
			})
			.catch((err) => {
				throw new Error(err);
			});

		updateActionButtonsState(component, "copy");

	} catch (err) {
		console.error("Something went wrong", err);
	}
}

/**
 * Add a data type and id on the current component with the action passed in parameter
 * 
 * @param {HTMLElement} component 
 * @param {String} action 
 * @param {String} status 
 */
function addDataType(component, action, status) {
	if (component.dataset.cheaty_id === undefined) {
		component.dataset.cheaty_id = Date.now() + "_" + component.tagName; //? I use here Date.now() as part for a unqiue ID because it's humanly impossible to do an action on 2 sepearate composant at the same millisecond
		component.dataset.cheaty_index = globalIndex;
		globalIndex++;
	}	

	if (action === "hide") {
		component.dataset.cheaty_action_hide = status;
	} else if (action === "password") {
		component.dataset.cheaty_action_password = status;
	}
}

/**
 * Send a message to the popup witht the data of updated components
 * 
 * @see getListOfUpdatedComponents
 */
function sendDataToPopup() {
	try {
		chrome.runtime.sendMessage({
			command: "cheaty_get_data",
			components: getListOfUpdatedComponents()
		});
	} catch (error) {
		console.error(error);
	}
	
}

/**
 * Get the list off all the updated component on the page
 * 
 * @returns array
 */
function getListOfUpdatedComponents() {
	let componentsData = [];
	let find = true;
	let i = 0;

	while (find) {
		let component = document.querySelector('[data-cheaty_index="' + i + '"]');

		if (component == null || i > globalIndex) {
			find = false;
			break;
		}

		let actions = "|";
		if (component.dataset.cheaty_action_hide !== undefined) {
			actions = "hide:" + component.dataset.cheaty_action_hide + actions;
		}
		if (component.dataset.cheaty_action_password !== undefined) {
			actions = actions + "password:" + component.dataset.cheaty_action_password;
		}

		let componentData = {
			id: component.dataset.cheaty_id,
			html_id: component.id,
			index: component.dataset.cheaty_index,
			type: component.tagName,
			actions: actions,
		}

		componentsData.push(componentData);
		i++;
	}

	return componentsData === [] ? "empty" : componentsData;
}

/**
 * Reverse the action on the component passed in param
 * This method call sendDataToPopup to update the content of the popup
 * 
 * @see sendDataToPopup
 * @param {string} id of the component 
 * @param {string} action 
 */
function revertActionOnComponent(id, action) {
	let component = document.querySelector('[data-cheaty_id="' + id + '"]');

	if (action === "hide") {
		changeDisplayComponent(component);
	} else if (action === "password") {
		changePasswordTypeComponent(component);
	}

	sendDataToPopup();
}
