/**
 * Base class for objects that can be drawn on the canvas.
 * Provides methods for loading images, drawing objects, and drawing bounding frames.
 */
class DrawableObject {
  /** @type {HTMLImageElement} */
  img;

  /** @type {Object<string, HTMLImageElement>} */
  imageCache = {};

  /** @type {number} */
  currentImage = 0;

  /** @type {number} */
  x = 0;

  /** @type {number} */
  y;

  /** @type {number} */
  height = 160;

  /** @type {number} */
  width = 600;

  /**
   * Loads an image from a given path.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx - The 2D context of the canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a bounding box around the object (only for instances of `Character` or `Enemy1`).
   * @param {CanvasRenderingContext2D} ctx - The 2D context of the canvas.
   */
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Enemy1) {
      ctx.beginPath();
      ctx.lineWidth = "10";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Loads an array of images into the image cache.
   * @param {string[]} arr - An array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
