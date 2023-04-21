import "./style.css";
import "./cheaty-static.js";
import { getBrowser } from "./browser.js";

const CHROME_LINK_ID = "chrome-download-link";
const FIREFOX_LINK_ID = "firefox-download-link";
const EDGE_LINK_ID = "edge-download-link";
const FIRST_LINK_CONTAINER_ID = "first-link-container";

//TODO Clippy easter egg
// document.onkeydown = (e) => {
//Ctrl + Alt + N
// if (e.ctrlKey && e.altKey && e.key == "n") {
// 	if (selectMode) {
// 		stop();
// 	} else if (actionMode) {
// 		stopActionMode();
// 	} else {
// 		initProcess();
// 	}
// }
//if (e.code == "Escape" && (selectMode || actionMode)) {
// 	// Escape
// 	if (!actionMode) {
// 		stop();
// 	} else {
// 		stopActionMode();
// 	}
// }
// };

selectDownloadLink();

/**
 * Select the good download link for the browser
 */
function selectDownloadLink() {
	let browser = getBrowser();

	if (browser !== "other") {
		let linkContainer = document.getElementById(FIRST_LINK_CONTAINER_ID);
		let replaceLink;
		if (browser === "chrome") {
			replaceLink = document.getElementById(CHROME_LINK_ID);
		} else if (browser === "firefox") {
			replaceLink = document.getElementById(FIREFOX_LINK_ID);
		} else if (browser === "edge") {
			replaceLink = document.getElementById(EDGE_LINK_ID);
		}

		linkContainer.innerHTML = "";
		linkContainer.appendChild(replaceLink);
	}
}
