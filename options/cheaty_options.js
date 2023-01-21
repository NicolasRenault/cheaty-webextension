/**
 * Save data from the settings from to storage.sync
 *
 * @param {Event} e
 */
function saveOptions(e) {
	e.preventDefault();

	chrome.storage.sync.set({
		inspectorMode: document.querySelector("#inspector-mode").checked,
	});
}

/**
 * Get data from storage sync and set it in the form
 */
function restoreOptions() {
	function setCurrentChoice(result) {
		document.querySelector("#inspector-mode").checked =
			result.inspectorMode || false;
	}

	function onError(error) {
		document.querySelector("#msg").innerHTML += `Error: ${error}`;
	}

	// chrome.storage.sync.get("inspectorMode").then(setCurrentChoice, onError); //? This is not working in Firefox
	chrome.storage.sync.get("inspectorMode", function (items) {
		if (!chrome.runtime.error) {
			console.log(items);
			setCurrentChoice(items);
		}
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
