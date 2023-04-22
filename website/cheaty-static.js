/**
 * This file contains sample of code from the extension.
 * Some method may vary from the extension.
 * @link https://github.com/NicolasRenault/cheaty-webextention/tree/main/src
 */

import "./cheaty-static.css";

const CSS_CLASS_NAME_SELECTED = "cheaty-selected";
const CSS_CLASS_NAME_SELECTED_STATIC = "cheaty-selected-static";
const ACTION_BUTTON_CONTAINER_ID = "cheaty_action_button_container";
const HIDE_BUTTON_ID = "cheaty_hide_button";
const PASSWORD_BUTTON_ID = "cheaty_password_button";
const COPY_BUTTON_ID = "cheaty_copy_button";
const EYE_OPEN_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#98f79899" d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg>';
const EYE_CLOSE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff000099" d="M12 6a9.77 9.77 0 0 1 8.82 5.5a9.647 9.647 0 0 1-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68A11.738 11.738 0 0 0 1 11.5C2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42l1.41-1.41L3.42 2.45L2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02a2.5 2.5 0 0 1-2.5-2.5c0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75a4.6 4.6 0 0 0-.36 1.78a4.507 4.507 0 0 0 6.27 4.14l.98.98c-.88.24-1.8.38-2.75.38a9.77 9.77 0 0 1-8.82-5.5c.7-1.43 1.72-2.61 2.93-3.53z"/></svg>';
const TEXT_VISIBLE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#98f79899" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>';
const TEXT_NOT_VISIBLE_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff000099" d="M2 17h20v2H2v-2zm1.15-4.05L4 11.47l.85 1.48l1.3-.75l-.85-1.48H7v-1.5H5.3l.85-1.47L4.85 7L4 8.47L3.15 7l-1.3.75l.85 1.47H1v1.5h1.7l-.85 1.48l1.3.75zm6.7-.75l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H15v-1.5h-1.7l.85-1.47l-1.3-.75L12 8.47L11.15 7l-1.3.75l.85 1.47H9v1.5h1.7l-.85 1.48zM23 9.22h-1.7l.85-1.47l-1.3-.75L20 8.47L19.15 7l-1.3.75l.85 1.47H17v1.5h1.7l-.85 1.48l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H23v-1.5z"/></svg>';

const STATIC_BUTTONS = [
	"cheaty_hide_button_static_title",
	"cheaty_password_button_static_title",
	"cheaty_copy_button_static_title",
	"cheaty_hide_button_example_static",
	"cheaty_password_button_example_static",
	"cheaty_copy_button_example_static",
	"cheaty_popup_select_static_1",
	"cheaty_popup_hide_static_1",
	"cheaty_popup_select_static_2",
	"cheaty_popup_hide_static_2",
	"cheaty_popup_select_static_3",
	"cheaty_popup_hide_static_3",
	"cheaty_popup_select_static_4",
	"cheaty_popup_hide_static_4",
	"cheaty_popup_password_static_4",
];
const STATIC_SELECTION_DIV = ["selection_mode_example_static"];

let selectMode = false;
let globalIndex = 0;

initStaticListeners();

/**
 * Mandatory listener for the key shortcut
 * Run only once because overwrited in @initListeners
 *
 * @see initListeners
 * @param {Event} e
 */
document.onkeydown = (e) => {
	if (e.code == "ArrowUp" && selectMode) {
		// Arrow Up
		e.preventDefault();
		selectParentComponentStatic();
	} else if (e.code == "ArrowDown" && selectMode) {
		// Arrow Down
		e.preventDefault();
		selectChildComponentStatic();
	} else if (e.code == "ArrowLeft" && selectMode) {
		// Arrow Left
		e.preventDefault();
		selectPreviousSiblingComponentStatic();
	} else if (e.code == "ArrowRight" && selectMode) {
		// Arrow Right
		e.preventDefault();
		selectNextSiblingComponentStatic();
	}
};

document.onmousemove = () => {
	selectComponentStatic();
};

function initStaticListeners() {
	STATIC_BUTTONS.forEach((buttonId) => {
		let button = document.getElementById(buttonId);

		button.addEventListener("click", (e) => {
			if (button.dataset.action === "hide") {
				changeDisplayStaticComponent(
					button.dataset.target_id,
					buttonId
				);
			} else if (button.dataset.action === "password") {
				changePasswordTypeStaticComponent(
					button.dataset.target_id,
					button.dataset.value,
					buttonId,
					button.dataset.type_detail_id
				);
			} else if (button.dataset.action === "copy") {
				if (button.dataset.copy_target !== undefined) {
					copyExampleStaticComponent(
						button.dataset.target_id,
						button.dataset.copy_target,
						buttonId
					);
				} else {
					copyStaticComponent(button.dataset.target_id, buttonId);
				}
			} else if (button.dataset.action === "revert-select") {
				selectComponentTempStatic(button.dataset.target_id);
			} else if (button.dataset.action === "revert-hide") {
				changeDisplayComponentFromPopup(
					button.dataset.target_id,
					buttonId
				);
			} else if (button.dataset.action === "revert-hide-hard") {
				changeHardDisplayComponentFromPopup(
					button.dataset.target_id,
					buttonId
				);
			} else if (button.dataset.action === "revert-password") {
				changePasswordTypeStaticComponentFromPopup(
					button.dataset.target_id,
					button.dataset.value,
					buttonId,
					button.dataset.type_detail_id
				);
			}
		});
	});
}

/**
 * Select the component under the mouse if one of his parents it in the STATIC_SELECTION_DIV array
 *
 * @see STATIC_SELECTION_DIV
 */
function selectComponentStatic() {
	let hovers = document.querySelectorAll(":hover");

	if (hovers.length !== 0) {
		let hover = hovers.item(hovers.length - 1);

		if (
			hover.closest("section") !== null &&
			STATIC_SELECTION_DIV.includes(hover.closest("section").id)
		) {
			selectMode = true;
			addBorderToComponentStatic(hover);
		} else {
			selectMode = false;
			removeAllBorder();
		}
	}
}

/**
 * Select the component with the id for a certain time
 *
 * @param {string} id
 */
function selectComponentTempStatic(id) {
	let component = document.getElementById(id);

	if (
		component == null ||
		component.classList.contains(CSS_CLASS_NAME_SELECTED_STATIC)
	) {
		return;
	}

	component.classList.add(CSS_CLASS_NAME_SELECTED_STATIC);
	setTimeout(() => {
		component.classList.remove(CSS_CLASS_NAME_SELECTED_STATIC);
	}, 5000);
}

/**
 * Select the parent of the component with the class CSS_CLASS_NAME_SELECTED if one of his parents it in the STATIC_SELECTION_DIV array
 *
 * @see STATIC_SELECTION_DIV
 * @see CSS_CLASS_NAME_SELECTED
 */
function selectParentComponentStatic() {
	let selectedComponent = document.querySelector(
		"." + CSS_CLASS_NAME_SELECTED
	);

	if (
		selectedComponent !== null &&
		selectedComponent.parentElement !== null &&
		STATIC_SELECTION_DIV.includes(
			selectedComponent.parentElement.closest("section").id
		)
	) {
		selectedComponent = selectedComponent.parentElement;
		selectMode = true;
		addBorderToComponentStatic(selectedComponent);
	}
}

/**
 * Select the child of the component with the class CSS_CLASS_NAME_SELECTED if one of his parents it in the STATIC_SELECTION_DIV array
 *
 * @see STATIC_SELECTION_DIV
 * @see CSS_CLASS_NAME_SELECTED
 */
function selectChildComponentStatic() {
	let selectedComponent = document.querySelector(
		"." + CSS_CLASS_NAME_SELECTED
	);

	if (
		selectedComponent !== null &&
		selectedComponent.firstElementChild !== null &&
		STATIC_SELECTION_DIV.includes(
			selectedComponent.firstElementChild.closest("section").id
		)
	) {
		selectedComponent = selectedComponent.firstElementChild;
		selectMode = true;
		addBorderToComponentStatic(selectedComponent);
	}
}

/**
 * Select the previous sibling of the component with the class CSS_CLASS_NAME_SELECTED if one of his parents it in the STATIC_SELECTION_DIV array
 *
 * @see STATIC_SELECTION_DIV
 * @see CSS_CLASS_NAME_SELECTED
 */
function selectPreviousSiblingComponentStatic() {
	let selectedComponent = document.querySelector(
		"." + CSS_CLASS_NAME_SELECTED
	);

	if (
		selectedComponent !== null &&
		selectedComponent.previousElementSibling !== null &&
		STATIC_SELECTION_DIV.includes(
			selectedComponent.previousElementSibling.closest("section").id
		)
	) {
		selectedComponent = selectedComponent.previousElementSibling;
		selectMode = true;
		addBorderToComponentStatic(selectedComponent);
	}
}

/**
 * Select the next sibling of the component with the class CSS_CLASS_NAME_SELECTED if one of his parents it in the STATIC_SELECTION_DIV array
 *
 * @see STATIC_SELECTION_DIV
 * @see CSS_CLASS_NAME_SELECTED
 */
function selectNextSiblingComponentStatic() {
	let selectedComponent = document.querySelector(
		"." + CSS_CLASS_NAME_SELECTED
	);

	if (
		selectedComponent !== null &&
		selectedComponent.nextElementSibling !== null &&
		STATIC_SELECTION_DIV.includes(
			selectedComponent.nextElementSibling.closest("section").id
		)
	) {
		selectedComponent = selectedComponent.nextElementSibling;
		selectMode = true;
		addBorderToComponentStatic(selectedComponent);
	}
}

function addBorderToComponentStatic(component) {
	removeAllBorder();
	component.classList.add(CSS_CLASS_NAME_SELECTED);
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
		}
	}
}

/**
 * Update an action menu button by it's ID and action
 *
 * @param {HTMLElement} component
 * @param {string} buttonId
 * @param {string} action
 */
function updateStaticActionButtonsState(component, buttonId, action) {
	if (document.getElementById(buttonId) != null) {
		if (action === "hide") {
			if (component.style.opacity == 0) {
				document.getElementById(buttonId).innerText = "Show";
			} else {
				document.getElementById(buttonId).innerText = "Hide";
			}
		} else if (
			action === "password" &&
			document.getElementById(buttonId) !== null
		) {
			if (component.tagName === "INPUT") {
				if (component.type == "password") {
					document.getElementById(buttonId).innerText =
						"Show password";
				} else {
					document.getElementById(buttonId).innerText =
						"Hide as password";
				}
			} else {
				if (component.innerText.includes("•")) {
					document.getElementById(buttonId).innerText =
						"Show password";
				} else {
					document.getElementById(buttonId).innerText =
						"Hide as password";
				}
			}
		} else if (action === "copy" || action === "copy-example") {
			document.getElementById(buttonId).innerText = "Copied";
			//set timout of 10 seconds
			if (action === "copy") {
				setTimeout(() => {
					document.getElementById(buttonId).innerText = "Copy";
				}, 2000);
			}
		}
	}
}

/**
 * Update and add svg to the button from the param values
 *
 * @param {string} buttonId
 * @param {string} action
 * @param {string} status
 */
function updatePopupButton(buttonId, action, status) {
	let button = document.getElementById(buttonId);
	button.innerHTML = "";

	const parser = new DOMParser();

	if (status === "ON") {
		if (action === "hide") {
			button.appendChild(
				parser.parseFromString(EYE_OPEN_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Hide element";
		} else if (action === "password") {
			button.appendChild(
				parser.parseFromString(TEXT_VISIBLE_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Hide password";
		}
	} else if (status === "OFF") {
		if (action === "hide") {
			button.appendChild(
				parser.parseFromString(EYE_CLOSE_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Show element";
		} else if (action === "password") {
			button.appendChild(
				parser.parseFromString(TEXT_NOT_VISIBLE_ICON, "image/svg+xml")
					.documentElement
			);
			button.title = "Show password";
		}
	}

	return button;
}

/**
 * Hide/show the component in param by setting the opacity to 1/0
 * Call the method updateStaticActionButtonsState for the button by it's ID
 *
 * @param {HTMLElement} componentId
 * @param {string} buttonId
 */
function changeDisplayStaticComponent(componentId, buttonId) {
	let component = document.getElementById(componentId);
	if (component.style.opacity == 1) {
		component.style.opacity = 0;
	} else {
		component.style.opacity = 1;
	}

	updateStaticActionButtonsState(component, buttonId, "hide");
}

/**
 * Hide/show the component in param by setting the opacity to 1/0
 * Call the method updateStaticActionButtonsState for the button by it's ID
 *
 * @param {HTMLElement} componentId
 * @param {string} buttonId
 */
function changeDisplayComponentFromPopup(componentId, buttonId) {
	let component = document.getElementById(componentId);
	let status = undefined;

	if (component.style.opacity == 1) {
		component.style.opacity = 0;
		status = "OFF";
	} else {
		component.style.opacity = 1;
		status = "ON";
	}

	updatePopupButton(buttonId, "hide", status);
}

/**
 * Hide/show the component in param by setting the hidden attribut to true/false
 * Call the method updateStaticActionButtonsState for the button by it's ID
 *
 * @param {HTMLElement} componentId
 * @param {string} buttonId
 */
function changeHardDisplayComponentFromPopup(componentId, buttonId) {
	let component = document.getElementById(componentId);

	component.hidden = !component.hidden;
	let status = component.hidden ? "OFF" : "ON";

	updatePopupButton(buttonId, "hide", status);
}

/**
 * Hide/show the text input for the component in param by setting the input type to password or it's old value
 * Call the method updateStaticActionButtonsState for a button by it's ID
 *
 * @see updateStaticActionButtonsState
 * @param {string} componentId
 * @param {string} value
 * @param {string} buttonId
 * @param {string} type_detail_id
 */
function changePasswordTypeStaticComponent(
	componentId,
	value,
	buttonId,
	type_detail_id
) {
	let component = document.getElementById(componentId);

	if (component.tagName === "INPUT") {
		if (component.type == "password") {
			if (
				component.dataset.cheaty_password_default === "password" ||
				component.dataset.cheaty_password_default === undefined
			) {
				component.type = "text";
			} else {
				component.type = component.dataset.cheaty_password_default;
			}
		} else {
			component.type = "password";
		}
	} else {
		if (component.innerText === value) {
			component.innerText = "•".repeat(value.length + 2);
		} else {
			component.innerText = value;
		}
	}

	updateStaticActionButtonsState(component, buttonId, "password");

	/**
	 * Custom code to update the type detail of the component for the static example
	 */
	if (type_detail_id !== undefined) {
		let typeDetail = document.getElementById(type_detail_id);

		typeDetail.innerHTML = component.type;
	}
}

/**
 * Hide/show the text input for the component in param by setting the input type to password or it's old value
 * Call the method updateStaticActionButtonsState for a button by it's ID
 *
 * @see updateStaticActionButtonsState
 * @param {string} componentId
 * @param {string} value
 * @param {string} buttonId
 * @param {string} type_detail_id
 */
function changePasswordTypeStaticComponentFromPopup(
	componentId,
	value,
	buttonId,
	type_detail_id
) {
	let component = document.getElementById(componentId);
	let status = undefined;

	if (component.tagName === "INPUT") {
		if (component.type == "password") {
			if (
				component.dataset.cheaty_password_default === "password" ||
				component.dataset.cheaty_password_default === undefined
			) {
				component.type = "text";
				status = "ON";
			} else {
				component.type = component.dataset.cheaty_password_default;
				status = "ON";
			}
		} else {
			component.type = "password";
			status = "OFF";
		}
	} else {
		if (component.innerText === value || component.textContent === value) {
			component.innerText = "•".repeat(value.length + 2);

			if (component.tagName === "TEXTAREA") {
				component.textContent = "•".repeat(value.length * 2);
			}

			status = "OFF";
		} else {
			component.innerText = value;
			component.textContent = value;
			status = "ON";
		}
	}

	updatePopupButton(buttonId, "password", status);

	/**
	 * Custom code to update the type detail of the component for the static example
	 */
	if (type_detail_id !== undefined) {
		let typeDetail = document.getElementById(type_detail_id);

		typeDetail.innerHTML = component.type;
	}
}

/**
 * Copy the component to the clipboard
 * Call the method updateStaticActionButtonsState for a button by
 *
 * @param {string} componentId
 * @param {string} buttonId
 */
function copyStaticComponent(componentId, buttonId) {
	try {
		//Copy to the clipboard
		navigator.clipboard
			.writeText(document.getElementById(componentId).outerHTML)
			.then(() => {
				console.info("HTML Component copied to clipboard");
			})
			.catch((err) => {
				throw new Error(err);
			});

		updateStaticActionButtonsState(
			document.getElementById(componentId),
			buttonId,
			"copy"
		);
	} catch (error) {
		errorHandler(
			error,
			"copyComponent",
			"Copying currentComponent to the clipboard",
			"avigator.clipboard.writeText"
		);
	}
}

function copyExampleStaticComponent(componentId, targetId, buttonId) {
	let target = document.getElementById(targetId);

	target.hidden = false;

	try {
		//Copy to the clipboard
		navigator.clipboard
			.writeText(document.getElementById(componentId).outerHTML)
			.then(() => {
				console.info("HTML Component copied to clipboard");
			})
			.catch((err) => {
				throw new Error(err);
			});

		updateStaticActionButtonsState(
			document.getElementById(componentId),
			buttonId,
			"copy-example"
		);
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
