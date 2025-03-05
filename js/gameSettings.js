/**
 * Toggles the game pause state
 */
function togglePause() {
  if (!gameStarted || !world) {
    return;
  }

  if (isGamePaused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

/**
 * Resumes game activity
 */
function resumeGame() {
  isGamePaused = false;
  const settingsMenu = document.getElementById("settings-menu");
  if (settingsMenu) {
    settingsMenu.remove();
  }
  if (world) {
    world.run();
  }
}

/**
 * Pauses all game activity
 */
function pauseGame() {
  if (!world) return;

  isGamePaused = true;
  createSettingsMenu();
  world.pause();

  if (keyboard) {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
  }
}

/**
 * Creates and displays the settings menu with conditional fullscreen button
 */
function createSettingsMenu() {
  const settingsMenu = document.createElement("div");
  settingsMenu.id = "settings-menu";
  settingsMenu.innerHTML = pageContent.settings;

  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    const fullscreenBtn = settingsMenu.querySelector("#fullscreen-button");
    if (fullscreenBtn) {
      fullscreenBtn.remove();
    }
  } else {
    const fullscreenBtn = settingsMenu.querySelector("#fullscreen-button");
    if (fullscreenBtn) {
      fullscreenBtn.textContent = document.fullscreenElement
        ? "Exit Fullscreen"
        : "Fullscreen";
    }
  }

  document.body.appendChild(settingsMenu);
  attachSettingsMenuEvents();
}

/**
 * Attaches event listeners to settings menu buttons
 */
function attachSettingsMenuEvents() {
  document.getElementById("resume-button")?.addEventListener("click", () => {
    playButtonSound();
    togglePause();
  });

  if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    const fullscreenButton = document.getElementById("fullscreen-button");
    if (fullscreenButton && gameStarted) {
      fullscreenButton.addEventListener("click", () => {
        playButtonSound();
        toggleFullscreen();
        togglePause();
      });
    }
  }

  const mainMenuButton = document.getElementById("main-menu-button");
  if (mainMenuButton && gameStarted) {
    mainMenuButton.addEventListener("click", () => {
      playButtonSound();
      returnToMainMenu();
    });
    mainMenuButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      playButtonSound();
      returnToMainMenu();
    });
  }
}

/**
 * Resets the game state variables to prepare for returning to the main menu.
 */
function resetGameState() {
  isGamePaused = false;
  gameStarted = false;
}

/**
 * Removes the settings menu from the page if it exists.
 */
function removeSettingsMenu() {
  const settingsMenu = document.getElementById("settings-menu");
  if (settingsMenu) {
    settingsMenu.remove();
  }
}

/**
 * Hides the game canvas element.
 */
function hideGameCanvas() {
  const canvas = document.getElementById("canvas");
  if (canvas) {
    canvas.style.display = "none";
  }
}

/**
 * Displays the main menu and hides other game elements.
 */
function showMainMenu() {
  const mainMenu = document.querySelector(".title-screen");
  if (mainMenu) {
    mainMenu.style.display = "block";
  }
}

/**
 * Removes the death screen from the page if it exists.
 */
function removeDeathScreen() {
  const deathScreen = document.querySelector(".death-screen");
  if (deathScreen) {
    deathScreen.remove();
  }
}

/**
 * Displays the game overlay on the page.
 */
function showGameOverlay() {
  const overlay = document.getElementById("game-overlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
}

/**
 * Hides mobile controls and resets any game-related UI elements.
 */
function resetMobileControls() {
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.classList.remove("game-active");
  }
}

/**
 * Resets the world and game variables.
 */
function resetWorldAndKeyboard() {
  if (world) {
    world = null;
  }

  if (keyboard) {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
  }
}

/**
 * Returns to the main menu, resets game state, and initializes the page.
 */
function returnToMainMenu() {
  resetGameState();
  removeSettingsMenu();
  hideGameCanvas();
  showMainMenu();
  removeDeathScreen();
  showGameOverlay();
  resetMobileControls();
  resetWorldAndKeyboard();
  playMenuMusic();
  loadPage("main");
  initializeEventListeners();
}

/**
 * Waits for the DOM content to load, then loads the main page and sets up event listeners
 * to start playing menu music on user interaction (click, keydown, or touchstart).
 */
document.addEventListener("DOMContentLoaded", () => {
  loadPage("main");

  const startAudioOnInteraction = () => {
    if (currentPage === "main") {
      playMenuMusic();
    }
    document.removeEventListener("click", startAudioOnInteraction);
    document.removeEventListener("keydown", startAudioOnInteraction);
    document.removeEventListener("touchstart", startAudioOnInteraction);
  };

  document.addEventListener("click", startAudioOnInteraction);
  document.addEventListener("keydown", startAudioOnInteraction);
  document.addEventListener("touchstart", startAudioOnInteraction);
});

/**
 * Toggles fullscreen mode for the game.
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
  updateFullscreenButton();
  adjustCanvasHeight();
}

/**
 * Requests fullscreen mode for the document.
 */
function enterFullscreen() {
  const docElem = document.documentElement;
  docElem.requestFullscreen().catch((err) => {
    console.error(`Failed to enter fullscreen mode: ${err.message}`);
  });
  isFullscreen = true;
}

/**
 * Exits fullscreen mode for the document
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document
      .exitFullscreen()
      .then(() => {
        isFullscreen = false;
        adjustCanvasHeight();
      })
      .catch((err) => {
        console.error(`Error exiting fullscreen: ${err.message}`);
      });
  }
}

/**
 * Listens for fullscreen changes and adjusts the canvas height accordingly.
 */
document.addEventListener("fullscreenchange", () => {
  adjustCanvasHeight();
});

/**
 * Updates the fullscreen button text based on the current fullscreen state.
 */
function updateFullscreenButton() {
  const fullscreenBtn = document.getElementById("toggle-fullscreen");
  fullscreenBtn.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
}

/**
 * Adjusts the canvas height based on the fullscreen state
 */
function adjustCanvasHeight() {
  const canvas = document.getElementById("canvas");
  if (canvas) {
    canvas.style.height = document.fullscreenElement ? "100vh" : "480px";
    canvas.style.width = document.fullscreenElement ? "100vw" : "720px";
  }
}
