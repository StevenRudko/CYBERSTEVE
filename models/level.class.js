/**
 * Represents a game level with enemies, clouds, background objects, and crystals.
 */
class Level {
  /** @type {Array} - Array of enemies in the level */
  enemies;

  /** @type {Array} - Array of clouds in the level */
  clouds;

  /** @type {Array} - Array of background objects in the level */
  backgroundObjects;

  /** @type {Array} - Array of crystals in the level */
  crystals;

  /** @type {number} - X-coordinate where the level ends */
  level_end_x = 2950;

  /**
   * Creates a new Level instance with enemies, clouds, background objects, and crystals.
   *
   * @param {Array} enemies - List of enemies in the level.
   * @param {Array} clouds - List of clouds in the level.
   * @param {Array} backgroundObjects - List of background objects in the level.
   * @param {Array} crystals - List of crystals in the level.
   */
  constructor(enemies, clouds, backgroundObjects, crystals) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.crystals = crystals;
  }
}
