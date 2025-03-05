/**
 * Contains HTML content for different pages of the game, such as the main menu, controls, terms, and legal notice.
 * @type {Object}
 */
const pageContent = {
  /**
   * Main screen with title and navigation buttons.
   */
  main: `
      <div class="title-screen">
        <h1>CYBERSTEVE</h1>
        <div class="buttons">
          <button class="btn" id="start-game">Start Game</button>
          <button class="btn" id="toggle-fullscreen">Fullscreen</button>
          <button class="btn" id="show-controls">Controls</button>
          <button class="btn" id="show-terms">Terms of Use</button>
          <button class="btn" id="show-legal">Legal Notice</button>
        </div>
      </div>
    `,

  /**
   * Controls screen with keyboard instructions.
   */
  controls: `
      <div class="title-screen">
        <h1>Controls</h1>
        <div class="main">
          <div class="keyboard-controls">
            <h2>Keyboard Controls</h2>
            <ul>
              <li>Move Left: Left Arrow</li>
              <li>Move Right: Right Arrow</li>
              <li>Jump: Space</li>
              <li>Shoot: D</li>
              <li>Exit Fullscreen: ESC</li>
            </ul>
          </div>
          <button class="btn" id="back-to-main">Back to the homepage</button>
        </div>
      </div>
    `,

  /**
   * Terms of use with game conditions.
   */
  terms: `
      <div class="title-screen">
        <h1>Terms of use</h1>
        <div class="main">
          <p>By using this game, you agree to the following terms:</p>
          <ul>
            <li>Private use only.</li>
            <li>No commercial use.</li>
            <li>Disclaimer: No liability for damages.</li>
          </ul>
          <button class="btn" id="back-to-main">Back to the homepage</button>
        </div>
      </div>
    `,

  /**
   * Legal notice with contact and rights information.
   */
  legal: `
    <div class="title-screen">
      <h1>Legal notice</h1>
      <div class="main">
        <p>Game CYBERSTEVE by Steven Rudko.</p>
        <p>Contact: steven.rudko@outlook.com</p>
        <p>Address: Friedrich-Ebert-Straße 27, 34385 Bad Karlshafen</p>
        <p>All rights reserved.</p>
        <button class="btn" id="back-to-main">Back to the homepage</button>
      </div>
    </div>
  `,

  /**
   * Settings menu template
   * Provides pause menu functionality with resume, fullscreen and main menu options
   */
  settings: `
    <div id="settings-menu">
      <div class="settings-content">
        <h2>Menu</h2>
        <button id="resume-button" class="btn">Resume</button>
        <button id="fullscreen-button" class="btn desktop-only">Fullscreen</button>
        <button id="main-menu-button" class="btn">Main Menu</button>
      </div>
    </div>
  `,
};
