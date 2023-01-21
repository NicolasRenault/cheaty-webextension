// ? Google icons https://fonts.google.com/icons
const EYE_OPEN_ICON =
	'<span class="material-symbols-outlined">visibility</span>'; // ? https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Avisibility%3AFILL%400%3Bwght%40300%3BGRAD%40-25%3Bopsz%4024
const EYE_CLOSE_ICON =
	'<span class="material-symbols-outlined">visibility_off</span>'; // ? https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Avisibility_off%3AFILL%400%3Bwght%40300%3BGRAD%40-25%3Bopsz%4024
const TEXT_VISIBLE_ICON =
	'<span class="material-symbols-outlined">text_fields</span>'; // ? https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Atext_fields%3AFILL%400%3Bwght%40300%3BGRAD%40-25%3Bopsz%4024
const TEXT_NOT_VISIBLE_ICON =
	'<span class="material-symbols-outlined">password</span>'; // ? https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Apassword%3AFILL%400%3Bwght%40300%3BGRAD%40-25%3Bopsz%4024
const GOOGLE_ICON_CLASS = "material-symbols-outlined";

try {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		requestDataFromContentScript(tabs);
	});

	chrome.runtime.onMessage.addListener((message) => {
		if (message.command === "cheaty_get_data") {
			displayComponents(message.components);
		}
	});
} catch (error) {
	logError(error);
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
	chrome.tabs.sendMessage(tabs[0].id, {
		command: "cheaty_get_data",
	});
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

	button.classList.add(GOOGLE_ICON_CLASS);
	if (status === "ON") {
		if (action === "hide") {
			button.innerHTML = EYE_OPEN_ICON;
		} else if (action === "password") {
			button.innerHTML = TEXT_VISIBLE_ICON;
		}
		button.classList.add("on");
	} else if (status === "OFF") {
		if (action === "hide") {
			button.innerHTML = EYE_CLOSE_ICON;
		} else if (action === "password") {
			button.innerHTML = TEXT_NOT_VISIBLE_ICON;
		}
		button.classList.add("off");
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
		logError(error);
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
 * @param {string} message
 */
function logError(message) {
	console.error(message);

	let cheaty_error = document.getElementById("cheaty_error");
	cheaty_error.classList.add("visible");

	let logs = document.getElementById("logs");
	let error = document.createElement("pre");
	error.innerHTML = message;

	logs.appendChild(error);
}
