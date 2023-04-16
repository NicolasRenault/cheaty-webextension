/**
 * Get browser name
 *
 * @returns {string} browser name (chrome, firefox, edge, other)
 */
export function getBrowser() {
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
