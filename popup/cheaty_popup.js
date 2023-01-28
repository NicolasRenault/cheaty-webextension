const EYE_OPEN_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#98f79899" d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg>';
const EYE_CLOSE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff000099" d="M12 6a9.77 9.77 0 0 1 8.82 5.5a9.647 9.647 0 0 1-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68A11.738 11.738 0 0 0 1 11.5C2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42l1.41-1.41L3.42 2.45L2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02a2.5 2.5 0 0 1-2.5-2.5c0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75a4.6 4.6 0 0 0-.36 1.78a4.507 4.507 0 0 0 6.27 4.14l.98.98c-.88.24-1.8.38-2.75.38a9.77 9.77 0 0 1-8.82-5.5c.7-1.43 1.72-2.61 2.93-3.53z"/></svg>';
const TEXT_VISIBLE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#98f79899" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>';
const TEXT_NOT_VISIBLE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff000099" d="M2 17h20v2H2v-2zm1.15-4.05L4 11.47l.85 1.48l1.3-.75l-.85-1.48H7v-1.5H5.3l.85-1.47L4.85 7L4 8.47L3.15 7l-1.3.75l.85 1.47H1v1.5h1.7l-.85 1.48l1.3.75zm6.7-.75l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H15v-1.5h-1.7l.85-1.47l-1.3-.75L12 8.47L11.15 7l-1.3.75l.85 1.47H9v1.5h1.7l-.85 1.48zM23 9.22h-1.7l.85-1.47l-1.3-.75L20 8.47L19.15 7l-1.3.75l.85 1.47H17v1.5h1.7l-.85 1.48l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H23v-1.5z"/></svg>';

try {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		requestDataFromContentScript(tabs);
	});
} catch (error) {
	errorHandler(
		error,
		"main",
		"Querying on browser tabs to get current tabId",
		"chrome.tabs.query"
	);
}

try {
	chrome.runtime.onMessage.addListener((message) => {
		if (message.command === "cheaty_get_data") {
			displayComponents(message.components);
		}
	});
} catch (error) {
	errorHandler(
		error,
		"main",
		"Content script message listener subscription",
		"chrome.runtime.onMessage.addListener"
	);
}

/**
 * Set link to option page for the option button
 */
document
	.getElementById("optionsButton")
	.addEventListener("click", () => chrome.runtime.openOptionsPage());

/**
 * Send a request message to the content script to get the data informations of updated component by the extension
 *
 * @param {*} tabs
 */
function requestDataFromContentScript(tabs) {
	try {
		chrome.tabs.sendMessage(tabs[0].id, {
			command: "cheaty_get_data",
		});
	} catch (error) {
		errorHandler(
			error,
			"requestDataFromContentScript",
			"Sending message to current tab",
			"chrome.tabs.sendMessage"
		);
	}
}

/**
 * Take a list of components with actions and display it on the popup element
 *
 * @param {array} components
 */
function displayComponents(components) {
	let list = document.getElementById("cheaty_component_list");
	removeAllChildNodes(list);

	if (components.length !== 0) {
		let empty_placeholder = document.getElementById("empty_list");
		empty_placeholder.classList.remove("visible");

		components.forEach((el) => {
			let li = document.createElement("li");
			let componentId = el.id;

			let text_container = document.createElement("div");
			text_container.classList.add("text_container");

			let index = document.createElement("span");
			index.innerHTML = parseInt(el.index) + 1 + ".";
			text_container.appendChild(index);

			let type = document.createElement("span");
			type.innerHTML = el.type.toLowerCase();
			text_container.appendChild(type);

			if (el.html_id != "") {
				let html_Id = document.createElement("span");
				html_Id.innerHTML = "#" + el.html_id;
				text_container.appendChild(html_Id);
			}

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
 * Create and decorate a button from the param values
 *
 * @param {string} componentId
 * @param {string} action
 */
function createActionButton(componentId, action, status) {
	let button = document.createElement("button");

	button.addEventListener("click", () => {
		reverseComponent(componentId, action);
	});

	if (status === "ON") {
		if (action === "hide") {
			button.innerHTML = EYE_OPEN_ICON;
		} else if (action === "password") {
			button.innerHTML = TEXT_VISIBLE_ICON;
		}
	} else if (status === "OFF") {
		if (action === "hide") {
			button.innerHTML = EYE_CLOSE_ICON;
		} else if (action === "password") {
			button.innerHTML = TEXT_NOT_VISIBLE_ICON;
		}
	}

	return button;
}

/**
 * Send a message the content script to reverse the action on the component passed in param
 *
 * @param {string} componentId
 * @param {string} action
 */
function reverseComponent(componentId, action) {
	try {
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					command: "cheaty_reverse",
					componentId: componentId,
					action: action,
				});
			}
		);
	} catch (error) {
		errorHandler(
			error,
			"reverseComponent",
			"Querying browser to get the current tab and send a message"
		);
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
 * Display the error message
 *
 * @param {string|Error} message
 */
function displayError(message) {
	let cheaty_error = document.getElementById("cheaty_error");
	cheaty_error.classList.add("visible");

	let logs = document.getElementById("logs");
	let error = document.createElement("pre");
	error.innerHTML = message;

	logs.appendChild(message);
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
	displayError(error.message);

	let errorMessage = `An error occured in the method: ${method} while ${action}.\n`;
	if (codeSample !== null) {
		errorMessage += codeSample + ":";
	} else {
		errorMessage += "Error: ";
	}
	errorMessage += `${error.name}: ${error.message}`;

	console.error(errorMessage);
}
