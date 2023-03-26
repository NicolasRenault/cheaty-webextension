document.addEventListener("DOMContentLoaded", restoreOptions);
document
	.getElementById("inspector-mode")
	.addEventListener("change", saveOptions);

/**
 * Save data from the settings from to storage.sync
 *
 * @param {Event} e
 */
function saveOptions(e) {
	e.preventDefault();

	try {
		chrome.storage.sync.set({
			inspectorMode: document.querySelector("#inspector-mode").checked,
		});
	} catch (error) {
		errorHandler(
			error,
			"saveOptions",
			"Saving data to browser storage sync",
			"chrome.storage.sync.set"
		);
	}
}

/**
 * Get data from storage sync and set it in the form
 */
function restoreOptions() {
	try {
		function setCurrentChoice(result) {
			document.querySelector("#inspector-mode").checked =
				result.inspectorMode || false;
		}

		// chrome.storage.sync.get("inspectorMode").then(setCurrentChoice, onError); //? This is not working in Firefox
		chrome.storage.sync.get("inspectorMode", function (items) {
			if (!chrome.runtime.lastError) {
				setCurrentChoice(items);
			}
		});
	} catch (error) {
		errorHandler(
			error,
			"restoreOptions",
			"Geting data from browser store",
			"chrome.storage.sync.get"
		);
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
	error.innerText = message;

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
