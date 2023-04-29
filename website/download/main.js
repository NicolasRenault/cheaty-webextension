import "./style.css";
import { getBrowser } from "/browser.js";

const CHROME_LINK =
	"https://chrome.google.com/webstore/detail/cheaty/hmnpfcbdneiomcedoanfmddlejilpieh";
const FIREFOX_LINK = "https://addons.mozilla.org/fr/firefox/addon/cheaty/";
const EDGE_LINK =
	"https://microsoftedge.microsoft.com/addons/detail/cheaty/nfahmchdficdjoboiofifeakpngggaho";

redirectToDownloadPage();

function redirectToDownloadPage() {
	let browser = getBrowser();

	if (browser === "chrome") {
		window.location.href = CHROME_LINK;
	} else if (browser === "firefox") {
		window.location.href = FIREFOX_LINK;
	} else if (browser === "edge") {
		window.location.href = EDGE_LINK;
	}
}
