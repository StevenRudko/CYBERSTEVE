class StatusBar extends DrawableObject {
  /**
   * Images representing the full health states of the energy bar.
   * @type {string[]}
   */
  HEALTH_FULL_IMAGES = [
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar1.png",
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar2.png",
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar3.png",
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar4.png",
  ];

  /**
   * Images representing the damaged states of the energy bar.
   * @type {string[]}
   */
  HEALTH_DAMAGED_IMAGES = [
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar5.png",
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar6.png",
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar7.png",
    "../CYBERSTEVE/img/GUI/2 Bars/HealthBar8.png",
  ];

  /**
   * Current percentage of health.
   * @type {number}
   */
  percentage = 100;

  /**
   * Number of hits (damaged parts) of the health bar.
   * @type {number}
   */
  hits = 0;

  /**
   * Initializes the status bar by loading images and setting its initial properties.
   */
  constructor() {
    super();
    this.loadImages([
      ...this.HEALTH_FULL_IMAGES,
      ...this.HEALTH_DAMAGED_IMAGES,
    ]);
    this.height = 40;
    this.width = 200;
    this.x = 20;
    this.y = 20;
    this.setPercentage(100);
  }

  /**
   * Draws the status bar on the canvas based on the current health state.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  draw(ctx) {
    if (this.hits === 0) {
      this.drawFullHealth(ctx);
    } else if (this.hits < 4) {
      this.drawPartialHealth(ctx);
    } else {
      this.drawDamagedHealth(ctx);
    }
  }

  /**
   * Draws the full health status bar.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  drawFullHealth(ctx) {
    for (let i = 0; i < 4; i++) {
      this.drawImage(ctx, this.HEALTH_FULL_IMAGES[i], i);
    }
  }

  /**
   * Draws the partial health status bar when the health is damaged but not fully depleted.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  drawPartialHealth(ctx) {
    for (let i = 0; i < 4 - this.hits; i++) {
      this.drawImage(ctx, this.HEALTH_FULL_IMAGES[i], i);
    }
    for (let i = 0; i < this.hits; i++) {
      this.drawImage(ctx, this.HEALTH_DAMAGED_IMAGES[i], 4 - this.hits + i);
    }
  }

  /**
   * Draws the fully damaged health status bar.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  drawDamagedHealth(ctx) {
    for (let i = 0; i < 4; i++) {
      this.drawImage(ctx, this.HEALTH_DAMAGED_IMAGES[3], i);
    }
  }

  /**
   * Helper function to draw a single image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   * @param {string} imagePath - The path to the image to be drawn.
   * @param {number} index - The index of the image position on the status bar.
   */
  drawImage(ctx, imagePath, index) {
    let image = this.imageCache[imagePath];
    ctx.drawImage(
      image,
      this.x + index * image.width,
      this.y,
      image.width,
      image.height
    );
  }

  /**
   * Sets the health percentage and updates the hits accordingly.
   * @param {number} percentage - The health percentage (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.hits = 4 - Math.ceil(percentage / 25);
  }

  /**
   * Resolves the index of the health image to display based on the current percentage.
   * @returns {number} The index of the image to display.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 3;
    } else if (this.percentage > 75) {
      return 2;
    } else if (this.percentage > 50) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Increases the damage (hits) to the health bar when the entity takes damage.
   */
  takeHit() {
    this.hits++;
    this.hits = Math.min(this.hits, 4);
  }

  /**
   * Resets the health bar to its full state (100% health).
   */
  reset() {
    this.hits = 0;
    this.percentage = 100;
  }
}
