import "./style.css";
import "./cheaty_embedded.js";

const TUTORIAL_BUTTON = document.getElementById("tutorial-button");
const TUTORIAL_SECTION = document.getElementById("tutorial");
const RICK_SECTION = document.getElementById("rick");

/**
 * Open the tutorial section
 */
TUTORIAL_BUTTON.addEventListener("click", () => {
	TUTORIAL_SECTION.hidden = false;
});

/**
 * Close the tutorial section
 */
TUTORIAL_SECTION.addEventListener("click", function (e) {
	if (e.target.tagName === "A") return;
	TUTORIAL_SECTION.hidden = true;
});
document.addEventListener("keydown", (e) => {
	if (e.code == "Escape" && !TUTORIAL_SECTION.hidden) {
		TUTORIAL_SECTION.hidden = true;
	}
});

/**
 * Change opacity the rick section after three seconds to prevent the user to see the rick section before the page fully is loaded
 */
setTimeout(() => {
	RICK_SECTION.style.opacity = 1;
}, 3000);
