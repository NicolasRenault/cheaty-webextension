import "./style.css";
import "./cheaty_embedded.js";

const tutorialButton = document.getElementById("tutorial-button");
const tutorialSection = document.getElementById("tutorial");

/**
 * Open the tutorial section
 */
tutorialButton.addEventListener("click", () => {
	tutorialSection.hidden = false;
});

/**
 * Close the tutorial section
 */
tutorialSection.addEventListener("click", function (e) {
	if (e.target !== this) return;
	tutorialSection.hidden = true;
});
document.addEventListener("keydown", (e) => {
	if (e.code == "Escape" && !tutorialSection.hidden) {
		tutorialSection.hidden = true;
	}
});
