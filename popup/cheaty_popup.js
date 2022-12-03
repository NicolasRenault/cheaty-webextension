console.log("yea");
let list = document.getElementById("cheaty_component_list");

//TODO Remove
let logs = document.getElementById("logs");
logs.innerHTML = logs.innerHTML + "LOGS : "

browser.tabs.query({active: true, currentWindow: true})
    .then(requestDataFromContentScript)
    .catch(reportError);

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "cheaty_get_data") {
        displayComponents(message.components);
    }
});
/**
 * Send a request message to the content script to get the data informations of updated component by the extension 
 * 
 * @param {*} tabs 
 */
function requestDataFromContentScript(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        command: "cheaty_get_data",
    });
}

function reportError(error) {
    logs.innerHTML = logs.innerHTML + " " + error;
}

try {
    
} catch (error) {
    logs.innerHTML = logs.innerHTML + " " + error;
}

function displayComponents(components) {
    logs.innerHTML = logs.innerHTML + " component:  " + components + " type:  " + typeof components;

    if (components !== undefined) { //TODO Find case if empty
        components.forEach((el) => {
            let li = document.createElement("li");
            li.innerHTML = el[0] + " " + el[1];
            list.appendChild(li);
            logs.innerHTML = logs.innerHTML + " " + li.innerHTML;
        });
    } else {
        list.innerHTML = "Nothing yet";
    }    
}

// logs.innerHTML = logs.innerHTML + " component lenght " + components.length;

//TODO Remove
logs.innerHTML = logs.innerHTML + " " + Date();