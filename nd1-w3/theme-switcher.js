/**
 * Theme Switcher
 * Toggles between colorful and black & white themes
 */

(function () {
  // Theme configuration
  const THEMES = {
    colorful: {
      stylesheet: "styles.css",
      icon: "🎨",
      label: "Colorful",
      nextTheme: "bw",
    },
    bw: {
      stylesheet: "styles-bw.css",
      icon: "⚫",
      label: "Black & White",
      nextTheme: "colorful",
    },
  };

  const STORAGE_KEY = "theme-preference";
  const DEFAULT_THEME = "colorful";

  /**
   * Get current theme from localStorage or default
   */
  function getCurrentTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  /**
   * Save theme preference to localStorage
   */
  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * Apply the theme by updating the stylesheet link
   */
  function applyTheme(theme) {
    const themeLink = document.getElementById("theme-stylesheet");
    if (themeLink) {
      themeLink.href = THEMES[theme].stylesheet;
    }
  }

  /**
   * Update the toggle button icon
   */
  function updateButton(theme) {
    const button = document.getElementById("theme-toggle");
    if (button) {
      const nextTheme = THEMES[theme].nextTheme;
      button.textContent = THEMES[nextTheme].icon;
      button.setAttribute(
        "aria-label",
        `Switch to ${THEMES[nextTheme].label} theme`
      );
      button.setAttribute(
        "title",
        `Switch to ${THEMES[nextTheme].label} theme`
      );
    }
  }

  /**
   * Toggle between themes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const nextTheme = THEMES[currentTheme].nextTheme;

    applyTheme(nextTheme);
    saveTheme(nextTheme);
    updateButton(nextTheme);

    // Log for debugging
    console.log(`Theme switched from ${currentTheme} to ${nextTheme}`);
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
    updateButton(currentTheme);

    // Attach event listener to toggle button
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.addEventListener("click", toggleTheme);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();
