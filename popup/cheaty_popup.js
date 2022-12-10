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

/**
 * Take a list of components with actions and display it on the popup element
 * 
 * @param {array} components 
 */
function displayComponents(components) {
    removeAllChildNodes(list);

    if (components !== undefined) { //TODO Find case if empty
        components.forEach((el) => {
            let li = document.createElement("li");
            let componentId = el.id;

            let index = document.createElement("span");
            index.innerHTML = (parseInt(el.index) + 1) + ".";
            li.appendChild(index);
            
            let type = document.createElement("span");
            type.innerHTML = el.type.toLowerCase();
            li.appendChild(type);

            if (el.html_id != "") {
                let html_Id = document.createElement("span");
                html_Id.innerHTML = "#" + el.html_id;
                li.appendChild(html_Id);
            }
            
            let actions = el.actions.split("|");
            
            if (actions[0] !== "") {
                li.appendChild(createActionButton(componentId, "hide", actions[0].split(":")[1]));
            }
            
            if (actions[1] !== "") {
                li.appendChild(createActionButton(componentId, "password", actions[1].split(":")[1]));
            }

            list.appendChild(li);
        });
    } else {
        list.innerHTML = "Nothing yet";
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
        button.style.backgroundColor = "green";
    } else if (status === "OFF") {
        button.style.backgroundColor = "red";
    }

    button.innerHTML = action; //TODO change to better display

    return button;
}

/**
 * Send a message the content script to reverse the action on the component passed in param
 * 
 * @param {string} componentId 
 * @param {string} action 
 */
function reverseComponent(componentId, action) {
    browser.tabs.query({active: true, currentWindow: true})
        .then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "cheaty_reverse",
                componentId: componentId,
                action: action,
            });
        })
        .catch(reportError);
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
// logs.innerHTML = logs.innerHTML + " component lenght " + components.length;

//TODO Remove
logs.innerHTML = logs.innerHTML + " " + Date();