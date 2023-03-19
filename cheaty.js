const CSS_CLASS_NAME_SELECTION = "cheaty-selection";
const CSS_CLASS_NAME_SELECTED = "cheaty-selected";
const ACTION_BUTTON_CONTAINER_ID = "cheaty_action_button_container";
const HIDE_BUTTON_ID = "cheaty_hide_button";
const PASSWORD_BUTTON_ID = "cheaty_password_button";
const PASSWORD_CLASS = "cheaty_input";
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

let firstInit = true;
let selectMode = false;
let globalIndex = 0;
let actionMode = false;
let currentComponent = null;
let listOfSelected = null;
let inspectorMode = false;

console.info("Cheaty extension is enable");

/**
 * Mandatory listener for the key shortcut
 * Run only once because overwrited in @initListeners
 *
 * @see initListeners
 * @param {Event} e
 */
document.onkeydown = (e) => {
	//Ctr + Alt + N
	if (e.ctrlKey && e.altKey && e.key == "n") {
		initOnce();
		initProcess();
	}
};

/**
 * Init the process
 */
function initProcess() {
	selectMode = false;
	actionMode = false;
	addSelectionClassToBody();
	selectComponent();
	initSelectionMode();
}

/**
 * Run methods only once. Usefull for method that don't need to be trigger before the extension is being used
 */
function initOnce() {
	if (firstInit) {
		initListeners();
		initStorage();
		initCursorsVariable();

		firstInit = !firstInit;
	}
}

/**
 * Insert cursors custom CSS variables with path url to the page
 */
function initCursorsVariable() {
	let penUrl = "url(" + chrome.runtime.getURL("icons/cursor_32x32.png") + ")";

	document.documentElement.style.setProperty(
		"--cheaty-cursor-pen-url",
		penUrl
	);
}

/**
 * Init listeners
 */
function initListeners() {
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

	try {
		chrome.runtime.onMessage.addListener((message) => {
			if (message.command === "cheaty_get_data") {
				sendDataToPopup();
			} else if (message.command === "cheaty_reverse") {
				revertActionOnComponent(message.componentId, message.action);
			} else if (message.command === "cheaty_select") {
				selectComponentByCheatyId(message.componentId);
				initActionMode();
			}
		});
	} catch (error) {
		errorHandler(
			error,
			"initListeners",
			"Popup message listener subscription",
			"chrome.runtime.onMessage.addListener"
		);
	}
}

/**
 * Get data from the browser storage
 */
function initStorage() {
	try {
		chrome.storage.sync.get("inspectorMode", function (items) {
			if (!chrome.runtime.error) {
				setInspectorMode(items);
			}
		});
	} catch (error) {
		errorHandler(
			error,
			"initStorage",
			"Geting data from browser store",
			"chrome.storage.sync.get"
		);
	}
}

/**
 * Set the inspectorMode value from storage.sync
 *
 * @see inspectorMode
 * @param {Object} item
 */
function setInspectorMode(item) {
	if (item.inspectorMode) {
		inspectorMode = item.inspectorMode;
	}
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
		if (currentComponent == document.body) return;
		currentComponent = document.body;
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
	if (checkIfNotACheatyElement(currentComponent))
		currentComponent = document.body;

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
	currentComponentTagName.innerHTML = currentComponent.tagName.toLowerCase();
	inspectorInfosContainer.appendChild(currentComponentTagName);

	numberOfChar += currentComponentTagName.innerHTML.length;

	if (currentComponent.id !== "") {
		let currentComponentId = document.createElement("span");
		currentComponentId.id = INSPECTOR_INFOS_ID_ID;
		currentComponentId.innerHTML = "#" + currentComponent.id;
		inspectorInfosContainer.appendChild(currentComponentId);

		numberOfChar += currentComponentId.innerHTML.length;
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

		currentComponentClasses.innerHTML = classList;
		inspectorInfosContainer.appendChild(currentComponentClasses);

		numberOfChar += currentComponentClasses.innerHTML.length;
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
		hideButton.innerHTML = "Show";
	} else {
		hideButton.title = "Hide the selected element";
		hideButton.innerHTML = "Hide";
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
			passwordButton.innerHTML = "Show password";
		} else {
			passwordButton.title = "Change the type of the selected element";
			passwordButton.innerHTML = "Hide as password";
		}

		passwordButton.addEventListener(
			"click",
			changePasswordTypeCurrentComponent
		);
		actionMenuContainer.appendChild(passwordButton);
		actionMenuContainer.classList.add(PASSWORD_CLASS);
	}

	let copyButton = document.createElement("button");
	copyButton.id = COPY_BUTTON_ID;
	copyButton.title = "Copy the selected element";
	copyButton.innerHTML = "Copy";
	copyButton.addEventListener("click", copyCurrentComponent);
	actionMenuContainer.appendChild(copyButton);

	return actionMenuContainer;
}

/**
 * Set the top and left value of the element in param from the current component positions
 *
 * @param {HTMLElement} elm
 * @param {String} type Special type of the element example:"action"
 */
function setPositionFromCurrentComponent(elm, type) {
	let rect = currentComponent.getBoundingClientRect();
	let style = window.getComputedStyle(currentComponent, null);

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
	left = rect.right - rect.width / 2 + window.scrollX - containerWidth / 2;

	if (left <= 0) left = 5;
	else if (left + containerWidth + 5 > window.innerWidth)
		left = window.innerWidth - (containerWidth + 15);

	elm.style.left = left + "px";

	if (rect.top - ACTION_BUTTON_CONATINER_HEIGHT > 0) {
		elm.style.top =
			rect.top + window.scrollY - ACTION_BUTTON_CONATINER_HEIGHT + "px";
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
				document.getElementById(HIDE_BUTTON_ID).innerHTML = "Show";
			} else {
				document.getElementById(HIDE_BUTTON_ID).innerHTML = "Hide";
			}
		} else if (action === "password") {
			if (component.type == "password") {
				document.getElementById(PASSWORD_BUTTON_ID).innerHTML =
					"Show password";
			} else {
				document.getElementById(PASSWORD_BUTTON_ID).innerHTML =
					"Hide as password";
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
			"avigator.clipboard.writeText"
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
 * Send a message to the popup witht the data of updated components
 *
 * @see getListOfUpdatedComponents
 */
function sendDataToPopup() {
	try {
		chrome.runtime.sendMessage({
			command: "cheaty_get_data",
			components: getListOfUpdatedComponents(),
		});
	} catch (error) {
		errorHandler(
			error,
			"sendDataToPopup",
			"Sending data to the popup",
			"chrome.runtime.sendMessage"
		);
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
