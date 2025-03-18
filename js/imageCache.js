/**
 * Global image cache object to store all loaded images
 * @type {Object}
 */
let totalImageCache = {};

/**
 * Loads a single image and returns a promise
 * @param {string} path - The path to the image
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
 */
const loadSingleImage = (path) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = path;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

/**
 * Collects all images from DrawableObject instances in the game
 * @returns {Array<string>} Array of image paths
 */
function collectGameImages() {
  const images = [];

  // Add specific game images
  document.querySelectorAll("script").forEach((script) => {
    const content = script.textContent;
    const imgMatches = content.match(
      /["']\.\/img\/[^"']+\.(?:png|jpg|jpeg|gif)["']/g
    );
    if (imgMatches) {
      imgMatches.forEach((match) => {
        const path = match.substring(1, match.length - 1);
        if (!images.includes(path)) {
          images.push(path);
        }
      });
    }
  });

  return [...new Set([...images, ...imageCacheData])];
}

/**
 * Loads all images and updates the loading bar
 * @returns {Promise<void>} Promise that resolves when all images are loaded
 */
async function loadAllImages() {
  const images = collectGameImages();
  let loadedCount = 0;

  for (let i = 0; i < images.length; i++) {
    const path = images[i];
    try {
      const img = await loadSingleImage(path);
      totalImageCache[path] = img;
      loadedCount++;
      setLoadingBarForward(loadedCount, images.length);
    } catch (e) {
      console.log(`Problem with path: ${path}`);
      console.log(e);
    }
  }
}

/**
 * Updates the loading bar progress
 * @param {number} loaded - Number of images loaded
 * @param {number} total - Total number of images to load
 */
function setLoadingBarForward(loaded, total) {
  const percentage = (loaded / total) * 100;
  const loadingBar = document.getElementById("loading_bar");
  if (loadingBar) {
    loadingBar.style.left = `-${100 - percentage}%`;
  }
}

/**
 * Initializes the loading bar in the loading screen
 */
function initLoadingBar() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    // Create loading bar if it doesn't exist
    if (!document.getElementById("loading_bar")) {
      const loadingBarContainer = document.createElement("div");
      loadingBarContainer.className = "loading_bar_frame";
      loadingBarContainer.innerHTML = '<div id="loading_bar"></div>';
      loadingScreen.appendChild(loadingBarContainer);
    }
  }
}

/**
 * Overrides the DrawableObject's loadImage method to use the cache
 */
function patchDrawableObject() {
  const originalLoadImage = DrawableObject.prototype.loadImage;

  DrawableObject.prototype.loadImage = function (path) {
    if (totalImageCache[path]) {
      this.img = totalImageCache[path];
    } else {
      originalLoadImage.call(this, path);
    }
  };
}

/**
 * Initializes the image cache system
 * @returns {Promise<void>} Promise that resolves when caching is complete
 */
async function initImageCache() {
  initLoadingBar();
  await loadAllImages();
  patchDrawableObject();
  document.getElementById("loading-screen").style.display = "none";
}

if (typeof imageCacheData === "undefined") {
  window.imageCacheData = [];
}
