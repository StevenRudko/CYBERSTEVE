/**
 * Represents the energy bar of the character.
 * Manages the energy display and updates based on the character's health or energy status.
 */
class EnergyBar extends DrawableObject {
  /**
   * Array of image paths representing the full energy bar.
   */
  ENERGY_FULL_IMAGES = [
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar1.png",
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar2.png",
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar3.png",
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar4.png",
  ];

  /**
   * Array of image paths representing the damaged energy bar.
   */
  ENERGY_DAMAGED_IMAGES = [
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar5.png",
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar6.png",
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar7.png",
    "../CYBERSTEVE/img/GUI/2 Bars/EnergyBar8.png",
  ];

  percentage = 25;
  hits = 4;

  /**
   * Constructor for EnergyBar, initializes the energy images and sets the initial percentage.
   */
  constructor() {
    super();
    this.loadImages([
      ...this.ENERGY_FULL_IMAGES,
      ...this.ENERGY_DAMAGED_IMAGES,
    ]);
    this.height = 40;
    this.width = 200;
    this.x = 20;
    this.y = 40;
    this.setPercentage(25);
  }

  /**
   * Draws the energy bar when the energy is zero.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  drawEnergyZero(ctx) {
    for (let i = 0; i < 4; i++) {
      let imagePath = this.ENERGY_DAMAGED_IMAGES[3];
      let image = this.imageCache[imagePath];
      ctx.drawImage(
        image,
        this.x + i * image.width,
        this.y,
        image.width,
        image.height
      );
    }
  }

  /**
   * Draws the energy bar when the energy is partially damaged.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  drawPartialEnergy(ctx) {
    for (let i = 0; i < 4 - this.hits; i++) {
      let imagePath = this.ENERGY_FULL_IMAGES[i];
      let image = this.imageCache[imagePath];
      ctx.drawImage(
        image,
        this.x + i * image.width,
        this.y,
        image.width,
        image.height
      );
    }

    for (let i = 0; i < this.hits; i++) {
      let imagePath = this.ENERGY_DAMAGED_IMAGES[i];
      let image = this.imageCache[imagePath];
      ctx.drawImage(
        image,
        this.x + (4 - this.hits + i) * image.width,
        this.y,
        image.width,
        image.height
      );
    }
  }

  /**
   * Draws the energy bar when the energy is full.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  drawFullEnergy(ctx) {
    for (let i = 0; i < 4; i++) {
      let imagePath = this.ENERGY_DAMAGED_IMAGES[2];
      let image = this.imageCache[imagePath];
      ctx.drawImage(
        image,
        this.x + i * image.width,
        this.y,
        image.width,
        image.height
      );
    }
  }

  /**
   * Draws the energy bar based on the current percentage and energy state.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  draw(ctx) {
    if (this.percentage <= 0) {
      this.drawEnergyZero(ctx);
    } else if (this.hits < 4) {
      this.drawPartialEnergy(ctx);
    } else {
      this.drawFullEnergy(ctx);
    }
  }

  /**
   * Adds energy to the bar, ensuring it doesn't exceed 100%.
   * @param {number} value - The amount of energy to add.
   */
  addEnergy(value) {
    this.percentage = Math.min(100, this.percentage + value);
    this.setPercentage(this.percentage);
  }

  /**
   * Sets the percentage of the energy bar and updates the hit count accordingly.
   * @param {number} percentage - The new percentage of energy.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    this.hits = 4 - Math.ceil(this.percentage / 25);
    if (this.percentage === 0) {
      this.hits = 4;
    }
  }

  /**
   * Decreases the energy bar when the character takes damage.
   */
  takeHit() {
    this.hits++;
    this.hits = Math.min(this.hits, 4);
    this.percentage = Math.max(0, 100 - this.hits * 25);
  }

  /**
   * Resets the energy bar to full energy.
   */
  reset() {
    this.hits = 4;
    this.percentage = 0;
  }
}
