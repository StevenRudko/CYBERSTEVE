let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic = new Audio("../CYBERSTEVE/audio/game-music.mp3");
let menuMusic = new Audio("../CYBERSTEVE/audio/menu-music.mp3");
let gameStarted = false;
let isGamePaused = false;
let isMuted = localStorage.getItem("isMuted") === "true";
let currentPage = "main";
let isFullscreen = false;
let musicStarted = false;
let audioInitialized = false;
backgroundMusic.loop = true;
menuMusic.loop = true;
backgroundMusic.preload = "auto";
menuMusic.preload = "auto";
let audioContext;
gameIsMuted = localStorage.getItem("gameIsMuted") === "true";
menuIsMuted = localStorage.getItem("menuIsMuted") === "true";
const btnClickSound = new Audio("../CYBERSTEVE/audio/btn-click.mp3");
btnClickSound.volume = 0.2;

/**
 * Starts audio playback on first user interaction
 */
function startAudioOnFirstInteraction() {
  if (currentPage === "main") {
    playMenuMusic();
  }
}

/**
 * Initializes audio context for web audio API
 */
function initAudioContext() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.log("Web Audio API not supported.");
  }
}

/**
 * Sets initial audio volumes
 */
function setupInitialVolumes() {
  menuMusic.volume = 0.1;
  backgroundMusic.volume = 0.1;
}

/**
 * Resumes audio context if suspended
 */
async function resumeAudioContext() {
  if (audioContext?.state === "suspended") {
    await audioContext.resume();
  }
}

/**
 * Loads audio files
 */
function loadAudioFiles() {
  menuMusic.load();
  backgroundMusic.load();
}

/**
 * Removes event listeners for audio initialization
 */
function removeAudioListeners(initAudio) {
  ["click", "touchstart", "keydown"].forEach((event) => {
    document.removeEventListener(event, initAudio);
  });
}

/**
 * Main audio initialization handler
 */
async function handleAudioInit(e) {
  if (audioInitialized) return;

  try {
    await resumeAudioContext();
    loadAudioFiles();
    audioInitialized = true;
    if (currentPage === "main" && !isMuted) {
      await menuMusic.play();
    }
    removeAudioListeners(handleAudioInit);
  } catch (error) {
    console.log("Audio initialization waiting for user interaction");
  }
}

/**
 * Sets up audio event listeners
 */
function setupAudioListeners() {
  ["click", "touchstart", "keydown"].forEach((event) => {
    document.addEventListener(event, handleAudioInit, { once: true });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage("main");
  setupInitialVolumes();
  initAudioContext();
  setupAudioListeners();
});

backgroundMusic.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.3) {
    this.currentTime = 0;
  }
});

menuMusic.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.4) {
    this.currentTime = 0;
  }
});

/**
 * Plays menu music with error handling
 */
function playMenuMusic() {
  if (!audioInitialized) return;

  try {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic.playing = false;

    menuMusic.currentTime = 0;
    if (!isMuted) {
      menuMusic
        .play()
        .then(() => {
          menuMusic.playing = true;
        })
        .catch(console.error);
    }
  } catch (error) {
    console.log("Playback waiting for user interaction");
  }
}

/**
 * Plays game music with error handling
 */
function playGameMusic() {
  if (!audioInitialized) return;

  menuMusic.pause();
  menuMusic.currentTime = 0;
  menuMusic.playing = false;

  if (!isMuted) {
    backgroundMusic.currentTime = 0;
    backgroundMusic
      .play()
      .then(() => (backgroundMusic.playing = true))
      .catch(console.error);
  }
}

function playButtonSound() {
  if (!isMuted) {
    btnClickSound.currentTime = 0;
    btnClickSound.play().catch(console.error);
  }
}

/**
 * Toggles sound state
 */
function toggleSound() {
  playButtonSound();
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);

  menuMusic.muted = isMuted;
  backgroundMusic.muted = isMuted;
  btnClickSound.muted = isMuted;

  if (!isMuted) {
    if (gameStarted) {
      backgroundMusic.play().catch(console.error);
    } else {
      menuMusic.play().catch(console.error);
    }
  }

  applyMuteState();
  updateSoundIcon();
}

function applyGameMuteState() {
  if (world) {
    world.shooting_sounds?.forEach((sound) => (sound.muted = gameIsMuted));
    world.hitSounds?.forEach((sound) => (sound.muted = gameIsMuted));
    world.character?.walking_sound &&
      (world.character.walking_sound.muted = gameIsMuted);
    world.level?.enemies?.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        if (enemy.engineSound) enemy.engineSound.muted = gameIsMuted;
        if (enemy.hit_sound) enemy.hit_sound.muted = gameIsMuted;
      }
      if (enemy.hit_sound) enemy.hit_sound.muted = gameIsMuted;
    });
    world.shots?.forEach((shot) => {
      if (shot.collision_sound) shot.collision_sound.muted = gameIsMuted;
    });
    world.level?.crystals?.forEach((crystal) => {
      if (crystal.collect_sound) crystal.collect_sound.muted = gameIsMuted;
    });
  }
}

/**
 * Mutes the menu music based on the global `isMuted` variable.
 */
function muteMenuMusic() {
  if (menuMusic) menuMusic.muted = isMuted;
}

/**
 * Mutes the background music based on the global `isMuted` variable.
 */
function muteBackgroundMusic() {
  if (backgroundMusic) backgroundMusic.muted = isMuted;
}

/**
 * Mutes all audio elements on the page based on the global `isMuted` variable.
 */
function muteAllAudioElements() {
  document.querySelectorAll("audio").forEach((audio) => {
    audio.muted = isMuted;
  });
}

/**
 * Mutes the shooting sounds in the game based on the global `isMuted` variable.
 */
function muteShootingSounds() {
  if (world) {
    world.shooting_sounds?.forEach((sound) => {
      sound.muted = isMuted;
    });
  }
}

/**
 * Mutes the hit sounds in the game based on the global `isMuted` variable.
 */
function muteHitSounds() {
  if (world) {
    world.hitSounds?.forEach((sound) => {
      sound.muted = isMuted;
    });
  }
}

/**
 * Mutes the character sounds (walking, hit) in the game based on the global `isMuted` variable.
 */
function muteCharacterSounds() {
  if (world?.character) {
    if (world.character.walking_sound) {
      world.character.walking_sound.muted = isMuted;
    }
    if (world.character.hit_sound) {
      world.character.hit_sound.muted = isMuted;
    }
  }
}

/**
 * Mutes the enemy sounds (engine, hit) in the game based on the global `isMuted` variable.
 */
function muteEnemySounds() {
  if (world) {
    world.level?.enemies?.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        if (enemy.engineSound) enemy.engineSound.muted = isMuted;
        if (enemy.hit_sound) enemy.hit_sound.muted = isMuted;
      }
      if (enemy.hit_sound) enemy.hit_sound.muted = isMuted;
    });
  }
}

/**
 * Mutes the shot collision sounds in the game based on the global `isMuted` variable.
 */
function muteShotSounds() {
  if (world) {
    world.shots?.forEach((shot) => {
      if (shot.collision_sound) shot.collision_sound.muted = isMuted;
    });
  }
}

/**
 * Mutes the crystal collection sounds in the game based on the global `isMuted` variable.
 */
function muteCrystalSounds() {
  if (world) {
    world.level?.crystals?.forEach((crystal) => {
      if (crystal.collect_sound) crystal.collect_sound.muted = isMuted;
    });
  }
}

/**
 * Applies the mute state to all game audio elements.
 */
function applyMuteState() {
  muteMenuMusic();
  muteBackgroundMusic();
  muteAllAudioElements();
  muteShootingSounds();
  muteHitSounds();
  muteCharacterSounds();
  muteEnemySounds();
  muteShotSounds();
  muteCrystalSounds();
}

/**
 * Saves the current mute state to localStorage.
 */
function saveMuteState() {
  localStorage.setItem("isMuted", isMuted);
}

/**
 * Update the sound icon based on the mute status
 */
function updateSoundIcon() {
  const soundOn = document.getElementById("sound-on");
  const soundOff = document.getElementById("sound-off");

  soundOn.style.display = isMuted ? "none" : "flex";
  soundOff.style.display = isMuted ? "flex" : "none";
}

/**
 * Loads the content of a specific page and updates the page view based on the given `pageName`.
 */
function loadPageContent(pageName) {
  const mainContent = document.querySelector("main");
  mainContent.innerHTML = pageContent[pageName];
  currentPage = pageName;
}

/**
 * Toggles visibility of the mobile controls based on the current page.
 */
function toggleMobileControls() {
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.classList.remove("game-active");
  }
}

/**
 * Toggles the visibility of the settings button depending on the current page.
 */
function toggleSettingsButton(pageName) {
  const settingsButton = document.getElementById("settings-button");
  if (settingsButton) {
    settingsButton.style.display =
      pageName === "main" ||
      pageName === "controls" ||
      pageName === "terms" ||
      pageName === "legal"
        ? "none"
        : "flex";
  }
}

/**
 * Plays the menu music if on the "main", "controls", "terms", or "legal" pages.
 */
function playMenuMusicIfRequired(pageName) {
  if (
    pageName === "main" ||
    pageName === "controls" ||
    pageName === "terms" ||
    pageName === "legal"
  ) {
    if (!menuMusic.currentTime || menuMusic.paused) {
      playMenuMusic();
    }
  }
}

/**
 * Initializes necessary event listeners after the page is loaded.
 */
function initializePageEventListeners() {
  initializeEventListeners();
}

/**
 * Loads a specific page, handles the visibility of UI elements, and plays menu music if needed.
 */
function loadPage(pageName) {
  loadPageContent(pageName);
  toggleMobileControls();
  toggleSettingsButton(pageName);
  playMenuMusicIfRequired(pageName);
  initializePageEventListeners();
}

/**
 * Initializes event listeners for various page navigation and actions.
 */
function initializeEventListeners() {
  initializeNavigationEventListeners();
  initializeActionEventListeners();
}

/**
 * Initializes event listeners for navigation buttons.
 */
function initializeNavigationEventListeners() {
  document.getElementById("show-controls")?.addEventListener("click", () => {
    playButtonSound();
    loadPage("controls");
  });

  document.getElementById("show-terms")?.addEventListener("click", () => {
    playButtonSound();
    loadPage("terms");
  });

  document.getElementById("show-legal")?.addEventListener("click", () => {
    playButtonSound();
    loadPage("legal");
  });

  document.getElementById("back-to-main")?.addEventListener("click", () => {
    playButtonSound();
    loadPage("main");
  });
}

/**
 * Initializes event listeners for action buttons (e.g., fullscreen, start game).
 */
function initializeActionEventListeners() {
  document
    .getElementById("toggle-fullscreen")
    ?.addEventListener("click", () => {
      playButtonSound();
      toggleFullscreen();
    });

  document.getElementById("start-game")?.addEventListener("click", () => {
    playButtonSound();
    startGame();
  });
}

/**
 * Starts the background music.
 */
function startMusic() {
  backgroundMusic.play();
  musicStarted = true;
}

/**
 * Starts the background music playback and sets the `musicStarted` flag to true once the music is successfully played.
 * Logs an error message if the music fails to play due to missing user interaction.
 */
function startMusic() {
  backgroundMusic
    .play()
    .then(() => {
      musicStarted = true;
    })
    .catch(() => {
      console.log("Waiting for user interaction to start music");
    });
}

/**
 * Initializes the game world with proper sound settings
 */
function init() {
  canvas = document.getElementById("canvas");
  if (!world) {
    world = new World(canvas, keyboard);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");

  window.onload = function () {
    hideLoadingScreen();
  };

  function hideLoadingScreen() {
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  }

  // Bestehender Code
  initMobileControls();
  setupSettingsButton();
  setupSoundButton();
});

/**
 * Listens for keydown events and updates the `keyboard` object to reflect the pressed keys.
 * - Arrow keys: Move the character up, down, left, or right.
 * - Spacebar: Trigger jump action.
 * - D key: Trigger shoot action.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

/**
 * Listens for keyup events and updates the `keyboard` object to reflect the released keys.
 * - Arrow keys: Stop movement when released.
 * - Spacebar: Stop jump action when released.
 * - D key: Stop shoot action when released.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Removes the death screen overlay and resets the game state to restart.
 */
function restartGame() {
  const deathScreen = document.querySelector(".death-screen");
  if (deathScreen) {
    deathScreen.remove();
  }

  world.resetWorld();
}

/**
 * Handles audio initialization and state
 */
function initializeGameAudio() {
  audioInitialized = true;
  menuMusic.pause();
  menuMusic.currentTime = 0;

  if (!isMuted) {
    backgroundMusic.play().catch(console.error);
  }
}

/**
 * Sets up UI elements for game start
 */
function setupGameUI() {
  const canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  document.querySelector(".title-screen").style.display = "none";

  const settingsButton = document.getElementById("settings-button");
  if (settingsButton) settingsButton.style.display = "flex";
}

/**
 * Initializes mobile controls if on touch device
 */
function initializeMobileControls() {
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.add("game-active");
  }
}

/**
 * Main game start coordinator
 */
function startGame() {
  setupGameUI();
  initializeGameAudio();
  initializeMobileControls();
  gameStarted = true;
  init();
}

/**
 * Toggles the visibility of the game overlay based on the canvas display state.
 */
function toggleGameOverlay() {
  const canvas = document.getElementById("canvas");
  const overlay = document.getElementById("game-overlay");

  overlay.style.display = "flex";
}

/**
 * Initializes the game environment after the document is loaded.
 * Sets up mobile controls and event listeners for settings and sound buttons.
 */
document.addEventListener("DOMContentLoaded", () => {
  initMobileControls();
  setupSettingsButton();
  setupSoundButton();
});

document.addEventListener("DOMContentLoaded", () => {
  const soundButton = document.getElementById("sound-button");
  if (soundButton) {
    soundButton.addEventListener("click", toggleSound);
  }

  if (isMuted) {
    applyMuteState();
    updateSoundIcon();
  }
});

const originalAudioConstructor = window.Audio;
window.Audio = function () {
  const audio = new originalAudioConstructor(...arguments);
  audio.muted = isMuted;
  return audio;
};
