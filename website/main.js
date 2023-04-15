import "./style.css";
import "./cheaty-embedded.js";

const CHROME_LINK_ID = "chrome-download-link";
const FIREFOX_LINK_ID = "firefox-download-link";
const EDGE_LINK_ID = "edge-download-link";
const FIRST_LINK_CONTAINER_ID = "first-link-container";

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

/**
 * Get browser name
 *
 * @returns {string} browser name (chrome, firefox, edge, other)
 */
function getBrowser() {
	//Get the user-agent string
	var userAgentString = navigator.userAgent;

	// Detect Chrome
	var chromeAgent = userAgentString.indexOf("Chrome") > -1;

	// Detect Firefox
	var firefoxAgent = userAgentString.indexOf("Firefox") > -1;

	// Detect Edge
	var edgeAgent = userAgentString.indexOf("Edge") > -1;

	//Detect Edge Chromium
	var edgeChromiumAgent = userAgentString.indexOf("Edg") > -1;

	if (edgeAgent || edgeChromiumAgent) {
		return "edge";
	} else if (chromeAgent) {
		return "chrome";
	} else if (firefoxAgent) {
		return "firefox";
	} else {
		return "other";
	}
}
