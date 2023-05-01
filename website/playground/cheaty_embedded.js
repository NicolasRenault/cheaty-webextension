/**
 * This file contains sample of code from the extension.
 * Some method may vary from the extension.
 * @link https://github.com/NicolasRenault/cheaty-webextention/tree/main/src
 */

import "./cheaty_embedded.css";

/**
 * PLAYGROUND
 */

const POPUP_BUTTON = document.getElementById("popup-button");
const POPUP_CONTAINER = document.getElementById("popup-container");
const OPTION_BUTTON = document.getElementById("cheaty_option_button");
const OPTION_SECTION = document.getElementById("option");
const OPTION_CONTAINER = document.getElementById("option_container");
const PLAYGROUND_ID = "playground";
const STATIC_SELECTION_DIV = [PLAYGROUND_ID];

POPUP_BUTTON.addEventListener("click", () => {
	stopAllProcess();
	POPUP_CONTAINER.hidden = !POPUP_CONTAINER.hidden;
	onPopupOpen();
});
OPTION_BUTTON.addEventListener("click", () => {
	OPTION_SECTION.hidden = false;
});

/**
 * Close the tutorial section
 */
OPTION_CONTAINER.addEventListener("click", function (e) {
	if (e.target !== this) return;
	OPTION_SECTION.hidden = true;
});

/**
 * Close on escape
 */
document.addEventListener("keydown", (e) => {
	if (e.code == "Escape") {
		console.log("escape 1");
		if (!OPTION_SECTION.hidden) {
			OPTION_SECTION.hidden = true;
		} else if (!POPUP_CONTAINER.hidden) {
			POPUP_CONTAINER.hidden = true;
		}
	}
});

/**
 * Check if the element is in the playground section
 *
 * @param {HTMLEL} element
 * @returns boolean
 */
function isInSelectionStaticDiv(element) {
	try {
		return (
			element.id === PLAYGROUND_ID ||
			STATIC_SELECTION_DIV.includes(element.closest("section").id) ||
			STATIC_SELECTION_DIV.includes(
				element.firstElementChild.closest("section").id
			)
		);
	} catch (error) {
		return STATIC_SELECTION_DIV.includes(element.id);
	}
}

/**
 * Stop all process
 */
function stopAllProcess() {
	if (actionMode) stopActionMode();
	if (selectMode) stop();
}

/**
 * CHEATY
 */

const CSS_CLASS_NAME_SELECTION = "cheaty-selection";
const CSS_CLASS_NAME_SELECTED = "cheaty-selected";
const ACTION_BUTTON_CONTAINER_ID = "cheaty_action_button_container";
const HIDE_BUTTON_ID = "cheaty_hide_button";
const PASSWORD_BUTTON_ID = "cheaty_password_button";
const COPY_BUTTON_ID = "cheaty_copy_button";
const INSPECTOR_INFOS_BAR_ID = "cheaty_inspector_infos_bar";
const INSPECTOR_INFOS_TAGNAME_ID = "cheaty_inspector_infos_tagname";
const INSPECTOR_INFOS_ID_ID = "cheaty_inspector_infos_id";
const INSPECTOR_INFOS_CLASSES_ID = "cheaty_inspector_infos_classes";
const ACTION_BUTTON_CONATINER_WIDTH_SMALL = 150;
const ACTION_BUTTON_CONATINER_WIDTH_BIG = 250;
const ACTION_BUTTON_CONATINER_HEIGHT = 48;
const INSPECTOR_INFOS_CONATINER_MAX_WIDTH_SMALL = 300;
const INSPECTOR_INFOS_CONATINER_MAX_WIDTH_BIG = 500;
const INSPECTOR_INFOS_CONATINER_MEDIA_MAX_WIDTH = 520;
const INPUT_TEXT_LIST = ["text", "email", "password", "search", "tel", "url"];

let selectMode = false;
let globalIndex = 0;
let actionMode = false;
let currentComponent = null;
let inspectorMode = false;

console.info("Cheaty extension embedded is enable");

/**
 * Init listeners
 *
 */
document.onkeydown = (e) => {
	if (selectMode || actionMode) {
		e.preventDefault();
	}

	//Ctrl + Alt + N
	if (e.ctrlKey && e.altKey && e.key == "n") {
		if (selectMode) {
			stop();
		} else if (actionMode) {
			stopActionMode();
		} else {
			initProcess();
		}
	}

	if (e.code == "ArrowUp" && selectMode) {
		// Arrow Up
		selectParentComponent();
	} else if (e.code == "ArrowDown" && selectMode) {
		// Arrow Down
		selectChildComponent();
	} else if (e.code == "ArrowLeft" && selectMode) {
		// Arrow Left
		selectPreviousSiblingComponent();
	} else if (e.code == "ArrowRight" && selectMode) {
		// Arrow Right
		selectNextSiblingComponent();
	} else if (e.code == "Escape" && (selectMode || actionMode)) {
		// Escape
		if (!actionMode) {
			stop();
		} else {
			stopActionMode();
		}
	} else if (e.code == "Enter" && selectMode) {
		// Enter
		if (!actionMode) {
			initActionMode();
		}
	}
};

document.onclick = (e) => {
	if (selectMode || actionMode) {
		e.preventDefault();
		if (!actionMode) initActionMode();
	}
};

document.onmousemove = () => {
	if (selectMode && !actionMode) {
		selectComponent();
	}
};

onresize = () => {
	if (actionMode) {
		moveActionMenu();
	} else if (selectMode) {
		moveInspectorInfosBar();
	}
};

/**
 * Init the process
 */
function initProcess() {
	if (!POPUP_CONTAINER.hidden) POPUP_CONTAINER.hidden = true;

	selectMode = false;
	actionMode = false;
	removeActionMenu();
	removeInspectorInfosBar();
	addSelectionClassToBody();
	selectComponent();
	initSelectionMode();
}

/**
 * Stop all the process
 */
function stop() {
	currentComponent = null;
	selectMode = false;
	actionMode = false;
	removeSelectionClass();
	removeInspectorInfosBar();
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
	removeInspectorInfosBar();
}

/**
 * Validate the current component, stop the selection mode and init action mode
 */
function initActionMode() {
	stopSelectionMode();
	actionMode = true;
	removeActionMenu();
	initActionMenu();
}

/**
 * Stop the action mode and start the selection mode
 */
function stopActionMode() {
	actionMode = false;
	removeActionMenu();
	initSelectionMode();
	selectCurrentComponent();
}

/**
 * Select the component under the mouse
 * If the mouse not on the page it select the body
 *
 * @see currentComponent
 */
function selectComponent() {
	let hovers = document.querySelectorAll(":hover");

	if (hovers.length == 0) {
		currentComponent = document.getElementById(PLAYGROUND_ID);
	} else {
		if (currentComponent == hovers.item(hovers.length - 1)) return;
		currentComponent = hovers.item(hovers.length - 1);
	}

	selectCurrentComponent();
}

/**
 * Select the parent of the current component
 */
function selectParentComponent() {
	if (currentComponent == null || currentComponent.parentElement == null)
		return;
	currentComponent = currentComponent.parentElement;
	selectCurrentComponent();
}

/**
 * Select the child of the current component
 */
function selectChildComponent() {
	if (currentComponent == null || currentComponent.firstElementChild == null)
		return;
	currentComponent = currentComponent.firstElementChild;
	selectCurrentComponent();
}

/**
 * Select the previous sibling of the current component
 */
function selectPreviousSiblingComponent() {
	if (
		currentComponent == null ||
		currentComponent.previousElementSibling == null
	)
		return;
	currentComponent = currentComponent.previousElementSibling;
	selectCurrentComponent();
}

/**
 * Select the next sibling of the current component
 */
function selectNextSiblingComponent() {
	if (currentComponent == null || currentComponent.nextElementSibling == null)
		return;
	currentComponent = currentComponent.nextElementSibling;
	selectCurrentComponent();
}

/**
 * Select component by it's Cheaty id
 *
 * @param {string} Cheaty id of the component
 */
function selectComponentByCheatyId(id) {
	let component = document.querySelector('[data-cheaty_id="' + id + '"]');
	currentComponent = component;

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
 * Add visual aspect to the current component
 */
function selectCurrentComponent() {
	if (
		checkIfNotACheatyElement(currentComponent) ||
		!isInSelectionStaticDiv(currentComponent)
	)
		currentComponent = document.getElementById(PLAYGROUND_ID);

	addBorderToCurrentComponent();
	removeInspectorInfosBar();
	initInspectorInfos();
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
 * Add an information box next to the current component with HTML type, id and classes information
 * Similar to inspector mode on web (inspired by Firefox inspector)
 */
function initInspectorInfos() {
	if (inspectorMode) {
		let inspectorInfosBar = generateInspectorInfosBar();
		document.body.appendChild(inspectorInfosBar);

		setPositionFromCurrentComponent(inspectorInfosBar, "inspector");
	}
}

/**
 * Move the action menu
 */
function moveInspectorInfosBar() {
	let inspectorInfosBar = document.getElementById(INSPECTOR_INFOS_BAR_ID);
	if (inspectorInfosBar !== null)
		setPositionFromCurrentComponent(inspectorInfosBar, "inspector");
}

/**
 * Remove the inspector infos bar from the page
 */
function removeInspectorInfosBar() {
	if (document.getElementById(INSPECTOR_INFOS_BAR_ID) !== null) {
		document.getElementById(INSPECTOR_INFOS_BAR_ID).remove();
	}
}

/**
 * Generate the inspector information bar
 *
 * @return HTMLElement
 */
function generateInspectorInfosBar() {
	let numberOfChar = 0;
	let inspectorInfosContainer = document.createElement("div");
	inspectorInfosContainer.id = INSPECTOR_INFOS_BAR_ID;

	let currentComponentTagName = document.createElement("span");
	currentComponentTagName.id = INSPECTOR_INFOS_TAGNAME_ID;
	currentComponentTagName.innerText = currentComponent.tagName.toLowerCase();
	inspectorInfosContainer.appendChild(currentComponentTagName);

	numberOfChar += currentComponentTagName.innerText.length;

	if (currentComponent.id !== "") {
		let currentComponentId = document.createElement("span");
		currentComponentId.id = INSPECTOR_INFOS_ID_ID;
		currentComponentId.innerText = "#" + currentComponent.id;
		inspectorInfosContainer.appendChild(currentComponentId);

		numberOfChar += currentComponentId.innerText.length;
	}

	if (currentComponent.classList.length !== 0) {
		let currentComponentClasses = document.createElement("span");
		currentComponentClasses.id = INSPECTOR_INFOS_CLASSES_ID;

		let classList = "";
		currentComponent.classList.forEach((element) => {
			if (
				![CSS_CLASS_NAME_SELECTION, CSS_CLASS_NAME_SELECTED].includes(
					element
				)
			) {
				classList += "." + element;
			}
		});

		currentComponentClasses.innerText = classList;
		inspectorInfosContainer.appendChild(currentComponentClasses);

		numberOfChar += currentComponentClasses.innerText.length;
	}

	inspectorInfosContainer.numberOfChar = numberOfChar;

	return inspectorInfosContainer;
}

/**
 * Init and place next to the current component the action menu
 */
function initActionMenu() {
	let actionMenu = generateActionMenu();
	setPositionFromCurrentComponent(actionMenu, "action");

	document.body.appendChild(actionMenu);
}

/**
 * Move the action menu
 */
function moveActionMenu() {
	let actionMenu = document.getElementById(ACTION_BUTTON_CONTAINER_ID);
	if (actionMenu !== null)
		setPositionFromCurrentComponent(actionMenu, "action");
}

/**
 * Remove the action menu from the page
 */
function removeActionMenu() {
	try {
		document.getElementById(ACTION_BUTTON_CONTAINER_ID).remove();
	} catch (error) {
		//? Do nothing
	}
}

/**
 * Generate the action button menu
 *
 * @return HTMLElement
 */
function generateActionMenu() {
	let actionMenuContainer = document.createElement("div");
	actionMenuContainer.id = ACTION_BUTTON_CONTAINER_ID;

	let hideButton = document.createElement("button");
	hideButton.id = HIDE_BUTTON_ID;

	if (currentComponent.style.display == "none") {
		hideButton.title = "Show the selected element";
		hideButton.innerText = "Show";
	} else {
		hideButton.title = "Hide the selected element";
		hideButton.innerText = "Hide";
	}

	hideButton.addEventListener("click", changeDisplayCurrentComponent);
	actionMenuContainer.appendChild(hideButton);

	if (
		currentComponent.tagName == "INPUT" &&
		INPUT_TEXT_LIST.includes(currentComponent.type)
	) {
		let passwordButton = document.createElement("button");
		passwordButton.id = PASSWORD_BUTTON_ID;

		if (currentComponent.type == "password") {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerText = "Show password";
		} else {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerText = "Hide as password";
		}

		passwordButton.addEventListener(
			"click",
			changePasswordTypeCurrentComponent
		);
		actionMenuContainer.appendChild(passwordButton);
	}

	let copyButton = document.createElement("button");
	copyButton.id = COPY_BUTTON_ID;
	copyButton.title = "Copy the selected element";
	copyButton.innerText = "Copy";
	copyButton.addEventListener("click", copyCurrentComponent);
	actionMenuContainer.appendChild(copyButton);

	return actionMenuContainer;
}

/**
 * Set the positions of the element in param from the current component positions
 * - If the current component is hidden, the possition is top: 1px, left: 1px
 * - If there is space upside the current component, the element is placed on top centered with the bottom and left position
 * - If there is space bellow the current component, the element is placed bellow centered with the top and left position
 * - If there is no space bellow or upside the current component, the element is placed on the top and left inside the current component
 *
 * @param {HTMLElement} elm
 * @param {String} type Special type of the element example:"action"
 */
function setPositionFromCurrentComponent(elm, type) {
	let rect = currentComponent.getBoundingClientRect();
	let style = window.getComputedStyle(currentComponent, null);

	//? If the current component is hidden, the possition is top: 1px, left: 1px
	if (style.getPropertyValue("display") == "none") {
		elm.style.left = "1px";
		elm.style.top = "1px";
		elm.classList.add("hidden");

		return;
	} else {
		elm.classList.remove("hidden");
	}

	let left = 0;
	let containerWidth = 0;

	//? Set the minimum width of the container
	if (type === "action") {
		containerWidth =
			currentComponent.tagName == "INPUT"
				? ACTION_BUTTON_CONATINER_WIDTH_BIG
				: ACTION_BUTTON_CONATINER_WIDTH_SMALL;
	} else if (type === "inspector") {
		let elmRect = elm.getBoundingClientRect();

		let inspectorInfosContainerMaxWidth =
			window.innerWidth > INSPECTOR_INFOS_CONATINER_MEDIA_MAX_WIDTH
				? INSPECTOR_INFOS_CONATINER_MAX_WIDTH_BIG
				: INSPECTOR_INFOS_CONATINER_MAX_WIDTH_SMALL;
		containerWidth =
			elm.numberOfChar >= 55
				? inspectorInfosContainerMaxWidth
				: elmRect.width;
	}

	//? Set the X position of the element with the left position
	left = rect.right - rect.width / 2 + window.scrollX - containerWidth / 2;

	if (left <= 0) left = 5;
	else if (left + containerWidth + 5 > window.innerWidth)
		left = window.innerWidth - (containerWidth + 15);

	elm.style.left = left + "px";

	//? Set the Y position of the element with the top or bottom position
	if (rect.top - ACTION_BUTTON_CONATINER_HEIGHT > 0) {
		elm.style.bottom =
			window.innerHeight - (rect.top + window.scrollY) + 11 + "px";
	} else {
		if (rect.bottom + ACTION_BUTTON_CONATINER_HEIGHT > window.innerHeight) {
			elm.style.top = rect.top + window.scrollY + 9 + "px";
		} else {
			elm.style.top = rect.top + window.scrollY + rect.height + 8 + "px";
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
			if (component.hidden) {
				document.getElementById(HIDE_BUTTON_ID).innerText = "Show";
			} else {
				document.getElementById(HIDE_BUTTON_ID).innerText = "Hide";
			}
		} else if (
			action === "password" &&
			document.getElementById(PASSWORD_BUTTON_ID) !== null
		) {
			if (component.type == "password") {
				document.getElementById(PASSWORD_BUTTON_ID).innerText =
					"Show password";
			} else {
				document.getElementById(PASSWORD_BUTTON_ID).innerText =
					"Hide as password";
			}
		} else if (action === "copy") {
			document.getElementById(COPY_BUTTON_ID).innerText = "Copied";

			setTimeout(() => {
				document.getElementById(COPY_BUTTON_ID).innerText = "Copy";
			}, 2000);
		}
	}

	if (!POPUP_CONTAINER.hidden) onPopupOpen();
}

/**
 * Call the method hideComponent for the current component
 *
 * @see changeDisplayComponent
 */
function changeDisplayCurrentComponent() {
	changeDisplayComponent(currentComponent);
}

/**
 * Hide/show the component in param by setting the hidden attribut to true/false
 *
 * @param {HTMLElement} component
 */
function changeDisplayComponent(component) {
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
	changePasswordTypeComponent(currentComponent);
}

/**
 * Hide/show the text input for the component in param by setting the input type to password or it's old value
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
	} catch (error) {
		errorHandler(
			error,
			"copyComponent",
			"Copying currentComponent to the clipboard",
			"navigator.clipboard.writeText"
		);
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
 * Get the list off all the updated component on the page
 *
 * @returns array
 */
function getListOfUpdatedComponents() {
	let componentsData = [];
	let find = true;
	let i = 0;

	while (find) {
		let component = document.querySelector(
			'[data-cheaty_index="' + i + '"]'
		);

		if (component == null || i > globalIndex) {
			find = false;
			break;
		}

		let actions = "|";
		if (component.dataset.cheaty_action_hide !== undefined) {
			actions = "hide:" + component.dataset.cheaty_action_hide + actions;
		}
		if (component.dataset.cheaty_action_password !== undefined) {
			actions =
				actions +
				"password:" +
				component.dataset.cheaty_action_password;
		}

		let componentData = {
			id: component.dataset.cheaty_id,
			html_id: component.id,
			index: component.dataset.cheaty_index,
			type: component.tagName,
			actions: actions,
		};

		componentsData.push(componentData);
		i++;
	}

	return componentsData === [] ? "empty" : componentsData;
}

/**
 * Reverse the action on the component passed in param
 *
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
}

/**
 * Properly handle error and log them into console.
 *
 * @param {Error} error
 * @param {string} method
 * @param {string} action
 * @param {string} codeSample
 */
function errorHandler(error, method, action, codeSample = null) {
	let errorMessage = `An error occured in the method: ${method} while ${action}.\n`;
	if (codeSample !== null) {
		errorMessage += codeSample + ":";
	} else {
		errorMessage += "Error: ";
	}
	errorMessage += `${error.name}: ${error.message}`;

	console.error(errorMessage);
}

/**
 * Check if the element in parameter is not an element generated by the extention
 *
 * @param {HTMLElement} element
 * @returns boolean
 */
function checkIfNotACheatyElement(element) {
	let cheatyElement = [
		ACTION_BUTTON_CONTAINER_ID,
		HIDE_BUTTON_ID,
		PASSWORD_BUTTON_ID,
		COPY_BUTTON_ID,
		INSPECTOR_INFOS_BAR_ID,
		INSPECTOR_INFOS_TAGNAME_ID,
		INSPECTOR_INFOS_ID_ID,
		INSPECTOR_INFOS_CLASSES_ID,
	];

	return cheatyElement.includes(element.id);
}

/**
 * POPUP
 */

const EYE_OPEN_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#98f79899" d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg>';
const EYE_CLOSE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff000099" d="M12 6a9.77 9.77 0 0 1 8.82 5.5a9.647 9.647 0 0 1-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68A11.738 11.738 0 0 0 1 11.5C2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42l1.41-1.41L3.42 2.45L2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02a2.5 2.5 0 0 1-2.5-2.5c0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75a4.6 4.6 0 0 0-.36 1.78a4.507 4.507 0 0 0 6.27 4.14l.98.98c-.88.24-1.8.38-2.75.38a9.77 9.77 0 0 1-8.82-5.5c.7-1.43 1.72-2.61 2.93-3.53z"/></svg>';
const TEXT_VISIBLE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#98f79899" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>';
const TEXT_NOT_VISIBLE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff000099" d="M2 17h20v2H2v-2zm1.15-4.05L4 11.47l.85 1.48l1.3-.75l-.85-1.48H7v-1.5H5.3l.85-1.47L4.85 7L4 8.47L3.15 7l-1.3.75l.85 1.47H1v1.5h1.7l-.85 1.48l1.3.75zm6.7-.75l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H15v-1.5h-1.7l.85-1.47l-1.3-.75L12 8.47L11.15 7l-1.3.75l.85 1.47H9v1.5h1.7l-.85 1.48zM23 9.22h-1.7l.85-1.47l-1.3-.75L20 8.47L19.15 7l-1.3.75l.85 1.47H17v1.5h1.7l-.85 1.48l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H23v-1.5z"/></svg>';

const SELECTION_FROM_POPUP_BUTTON = document.getElementById(
	"cheaty_init_selection_button"
);

SELECTION_FROM_POPUP_BUTTON.addEventListener("click", (e) => {
	e.preventDefault();
	setTimeout(initProcess, 200);
});

/**
 * Get the list of all components that have been updated and display it on the popup
 */
function onPopupOpen() {
	let components = getListOfUpdatedComponents();
	displayComponents(components);
}

/**
 * Take a list of components with actions and display it on the popup element
 *
 * @param {array} components
 */
function displayComponents(components) {
	let list = document.getElementById("cheaty_component_list");

	if (components.length !== 0) {
		removeAllChildNodes(list);

		let empty_placeholder = document.getElementById("empty_list");
		empty_placeholder.classList.remove("visible");

		components.forEach((el) => {
			let li = document.createElement("li");
			let componentId = el.id;

			let text_container = document.createElement("button");
			text_container.title = "Select element";
			text_container.classList.add("text_container");

			let index = document.createElement("span");
			index.innerText = parseInt(el.index) + 1 + ".";
			text_container.appendChild(index);

			let type = document.createElement("span");
			type.innerText = el.type.toLowerCase();
			text_container.appendChild(type);

			if (el.html_id != "") {
				let html_Id = document.createElement("span");
				html_Id.innerText = "#" + el.html_id;
				text_container.appendChild(html_Id);
			}

			text_container.addEventListener("click", () => {
				selectComponentByCheatyId(componentId);
				initActionMode();
			});

			li.appendChild(text_container);

			let button_container = document.createElement("div");
			button_container.classList.add("button_container");

			let actions = el.actions.split("|");

			if (actions[0] !== "") {
				button_container.appendChild(
					createActionButton(
						componentId,
						"hide",
						actions[0].split(":")[1]
					)
				);
			}

			if (actions[1] !== "") {
				button_container.appendChild(
					createActionButton(
						componentId,
						"password",
						actions[1].split(":")[1]
					)
				);
			}

			li.appendChild(button_container);
			list.appendChild(li);
		});
	}
}

/**
 * Remove all the childs of an element
 *
 * @param {HTMLElement} parent
 */
function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

/**
 * Create and decorate a button from the param values
 *
 * @param {string} componentId
 * @param {string} action
 */
function createActionButton(componentId, action, status) {
	let button = document.createElement("button");
	button.id = componentId + "_" + action;
	const PARSER = new DOMParser();

	button.addEventListener("click", () => {
		revertActionOnComponent(componentId, action);
		onPopupOpen();
	});

	if (status === "ON") {
		if (action === "hide") {
			button.appendChild(
				PARSER.parseFromString(EYE_OPEN_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Hide element";
		} else if (action === "password") {
			button.appendChild(
				PARSER.parseFromString(TEXT_VISIBLE_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Hide password";
		}
	} else if (status === "OFF") {
		if (action === "hide") {
			button.appendChild(
				PARSER.parseFromString(EYE_CLOSE_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Show element";
		} else if (action === "password") {
			button.appendChild(
				PARSER.parseFromString(TEXT_NOT_VISIBLE_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Show password";
		}
	}

	return button;
}

/**
 * OPTION
 */

const INSPECTOR_MODE_SWITCH = document.getElementById("inspector-mode");

/**
 * Inspector mode listener
 */
INSPECTOR_MODE_SWITCH.addEventListener("change", setInspectorMode);

/**
 * Set the inspector mode
 *
 * @param {HTMLElement} e
 */
function setInspectorMode(e) {
	inspectorMode = e.target.checked;
}
