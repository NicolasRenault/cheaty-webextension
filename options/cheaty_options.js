function saveOptions(e) {
    e.preventDefault();

    browser.storage.sync.set({
        inspectorMode: document.querySelector("#inspector-mode").checked
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#inspector-mode").checked = result.inspectorMode || false;
    }

    function onError(error) {
        document.querySelector("#msg").innerHTML += `Error: ${error}`;
    }

    let getting = browser.storage.sync.get("inspectorMode");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
