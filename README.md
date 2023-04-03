<div align="center">
  <a href="https://github.com/NicolasRenault/cheaty-webextention">
    <img src="images/cheaty-logo.png" alt="Logo" width="60" height="60">
  </a>

  <h3 align="center">Cheaty</h3>

  <p align="center">
    Extention for the web that feels illegal
    <br />
    <a href="https://cheaty.nicolasrenault.com">Website</a>
    ·
    <a href="https://cheaty.nicolasrenault.com/sandbox">Demo</a>
    ·
    <a href="https://cheaty.nicolasrenault.com/#download">Download</a>
    ·
    <a href="https://github.com/NicolasRenault/cheaty-webextention/issues/new">Report Bug</a>
    ·
    <a href="https://github.com/NicolasRenault/cheaty-webextention/issues/new">Request Feature</a>
  </p>
</div>
<br />

## About

Cheaty is a simple open-source web extension that allows you to do quick actions on HTML components without going into the inspector console.

With Cheaty you can:

-   Hide or display an HTML component on the page.
-   Switch a text input between text and password type.
-   Copy the outer HTML of an HTML component<sup><a href="https://developer.mozilla.org/en/docs/Web/API/Element/outerHTML">?</a></sup>

## Getting Started

### Installation

Install the extension [here](https://cheaty.nicolasrenault.com/#download) and make sure to enable it in your browser's settings. 
> **Warning**: The extension is not meant to work on mobile devices.

## Using the extension

### Starting the process

You can start using the extension by using this shortcut:

```shell
Ctrl + Alt + N
```

This will enable the **Selection mode**, change your cursor and add a border around the current hovered HTML component.

<img src="images/selection-mode.png" alt="Selection Mode" width="500" height="312">

Note that all your keys will be disabled while you're in this mode. Press **Escape** to leave it.

### Select a component

Once you are in **Selection mode**, you can pick the HTML component you want by hovering it with your mouse or using the arrow keys.
<br/>
Select the component by **clicking** on it or by pressing the **Enter** key. You have now enabled the **Action mode** and a menu appeared next to your selected HTML component. To go back to **Selection Mode** press **Escape**. _(Press **Escape** twice to stop the extension)_.

<img src="images/action-mode.png" alt="Action Mode" width="500" height="312">

You have 2 buttons that allow you to **Copy** the outerHTML<sup><a href="https://developer.mozilla.org/en/docs/Web/API/Element/outerHTML">?</a></sup> of your component or to **Hide** it from the page.

<img src="images/hide-action.png" alt="Hide Action" width="500" height="312">

You can click on **Show** to make the HTLM component reappear.

### Passwords

When selecting an **input text**<sup><a href="https://developer.mozilla.org/en/docs/Web/HTML/Element/input">?</a></sup> you have a new button in the action menu that allows you to **Hide/Show** the password.

<img src="images/password-on-action.png" alt="Show Action" width="500" height="312">

_When the input is a password_

<img src="images/password-off-action.png" alt="Show Password" width="500" height="312">

_You can as well switch back to password_

Here is the list of all the working input:

-   text
-   email
-   password
-   search
-   tel
-   url

> **Warning**: Note that every change you make only works for **This** instance of **This** page. Meaning that going to another page or reload the page will reset everything.

### Popup

You can open the extension popup by clicking on this icon in the extension bar of your browser:

<img src="images/cheaty-logo.png" alt="Logo" width="24" height="24">

By default, if you didn't use the extension yet, there is not a lot to see except links to the <i id="extension-parameters">**Parameters**</i> and the **Cheaty Website**:

<img src="images/popup-empty.png" alt="Popup empty" width="500" height="312">

Once you have edited the page with the extension, all the HTML components edited appear in the popup, named with their **type**<sup><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">?</a></sup> and **id**<sup><a href="https://developer.mozilla.org/en/docs/Web/API/Element/id">?</a></sup>:

<img src="images/popup-items.png" alt="Popup with items" width="500" height="312">

You can now revert all your change by simply clicking on the buttons on the right.

### Inspector Mode

In all browsers you have an [_Inspector_](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools) that allows you to see the **type**<sup><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">?</a></sup>, **id**<sup><a href="https://developer.mozilla.org/en/docs/Web/API/Element/id">?</a></sup> and **classes**<sup><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class">?</a></sup> of the HTML components. Here is an example on Chrome:

<img src="images/inspector-chrome-example.png" alt="Inspector on Chrome" width="500" height="312">

You can enable a similar feature for **Cheaty** in the parameters<sup><a href="#extension-parameters">?</a></sup> of the extensions:

<img src="images/inspector-parameters.png" alt="Inspector Parameters" width="500" height="312">

Once enabled you can now see when on **Selection Mode** the **type**<sup><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">?</a></sup>, **id**<sup><a href="https://developer.mozilla.org/en/docs/Web/API/Element/id">?</a></sup> and **classes**<sup><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class">?</a></sup> of the HTML components you're hovering.

<img src="images/inspector-on.png" alt="Inspector enabled" width="500" height="312">

## Contributing

<!-- >This section is strongly inspired by https://github.com/tonybaloney/vscode-pets/edit/master/docs/source/contributing.rst<-->

### Ideas and discussions

Have an awesome idea for a new feature? Please [open an issue](https://github.com/NicolasRenault/cheaty-webextention/issues/new) describing your idea!

### Reporting bugs

Something is not working as it should? Please [open an issue](https://github.com/NicolasRenault/cheaty-webextention/issues/new) giving as much information as you can.

-   Title - Summarize what the bug is with specific details.
-   Summary - If the title is too long, include a summary with additional details.
-   Visual/Screenshot - A picture is always worth the time. Include one if possible.
-   Expected/Actual Results - Explain what you expected to happen and what happened.
-   Steps to Reproduce - The steps to follow should be comprehensive, easy to understand, and short. We want to experience the bug first-hand.

### Fixing an issue

Since this project is open-source, you can also help by reviewing some of the [existing issues](https://github.com/NicolasRenault/cheaty-webextention/issues). Please make sure you have the [prettier extension](https://prettier.io/https://prettier.io/) installed on your IDE.

## Contact

Nicolas Renault - [Website](https://nicolasrenault.com) - [Github](https://github.com/NicolasRenault)

Project Link: [https://github.com/NicolasRenault/cheaty-webextention](https://github.com/NicolasRenault/cheaty-webextention)

## Resources

-   [Web Extensions](https://developer.mozilla.org/en/docs/Mozilla/Add-ons/WebExtensions)

## License

[MIT](https://github.com/NicolasRenault/cheaty-webextention/blob/main/LICENCE) © [Nicolas Renault](https://github.com/NicolasRenault)
