/**
 * @returns {void}
 */
function initMobileControls() {
  const buttons = {
    left: document.getElementById("left-btn"),
    right: document.getElementById("right-btn"),
    jump: document.getElementById("jump-btn"),
    shoot: document.getElementById("shoot-btn"),
  };

  const buttonMappings = {
    left: "LEFT",
    right: "RIGHT",
    jump: "SPACE",
    shoot: "D",
  };

  Object.entries(buttons).forEach(([key, btn]) => {
    if (btn) {
      setupTouchHandlers(btn, buttonMappings[key]);
      preventContextMenuOnButtons(btn);
    }
  });

  setupSoundButton();
  setupSettingsButton();
}

/**
 * Sets up touch event handlers for a given button element to control movement or actions.
 *
 * @param {HTMLElement} element - The button element to add touch events to.
 * @param {string} keyProperty - The property of the keyboard object that corresponds to the action.
 */
function preventContextMenuOnButtons(element) {
  if (element) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

/**
 * @param {HTMLElement} element - The button element to handle touches
 * @param {string} keyProperty - The keyboard property to update
 */
function setupTouchHandlers(element, keyProperty) {
  if (!element) return;

  element.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard[keyProperty] = true;
  });

  element.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard[keyProperty] = false;
  });

  element.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    keyboard[keyProperty] = false;
  });
}

/**
 * Sets up the settings button to toggle the pause state when clicked.
 * Logs an error if the button is not found.
 */
function setupSettingsButton() {
  const settingsButton = document.getElementById("settings-button");
  if (!settingsButton) return;

  settingsButton.style.outline = "none";
  settingsButton.addEventListener("click", handleButtonAction);
  settingsButton.addEventListener("touchstart", handleButtonAction);
}

/**
 * Sets up the sound button for both desktop and mobile
 */
function setupSoundButton() {
  const soundButton = document.getElementById("sound-button");
  if (!soundButton) return;

  soundButton.replaceWith(soundButton.cloneNode(true));
  const newSoundButton = document.getElementById("sound-button");

  newSoundButton.addEventListener("click", toggleSound);
  newSoundButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleSound();
  });
}

function isMobileDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function handleButtonAction(e) {
  if (e.type === "touchstart" && e.cancelable) {
    e.preventDefault();
    e.stopPropagation();
  }

  playButtonSound();

  const button = e.currentTarget;
  if (button.id === "sound-button") {
    toggleSound();
  } else if (button.id === "settings-button") {
    togglePause();
  }
}
