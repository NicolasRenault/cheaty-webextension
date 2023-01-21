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
		logError(error);
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
			if (!chrome.runtime.error) {
				console.log(items);
				setCurrentChoice(items);
			}
		});
	} catch (error) {
		logError(error);
	}
}

/**
 * Display the error message
 *
 * @param {string|Error} message
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

document.addEventListener("DOMContentLoaded", restoreOptions);
document
	.getElementById("inspector-mode")
	.addEventListener("change", saveOptions);
