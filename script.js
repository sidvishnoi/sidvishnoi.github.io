class DarkModeSwitcher extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <style>
        .theme-switch-wrapper {
          display: flex;
          align-items: center;
        }
        .theme-switch {
          display: inline-block;
          height: 1.4rem;
          position: relative;
          width: 2.5rem;
        }

        .theme-switch input {
          display: none;
        }

        .slider {
          background-color: #fff;
          bottom: 0;
          cursor: pointer;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          transition: 0.4s;
        }

        .slider:before {
          background-color: #000;
          bottom: 0.2rem;
          content: "";
          height: 1rem;
          left: 0.2rem;
          position: absolute;
          transition: 0.4s;
          width: 1rem;
        }

        input:checked + .slider {
          background-color: yellow;
        }

        input:checked + .slider:before {
          transform: translateX(100%);
        }
      </style>
      <div class="theme-switch-wrapper" aria-hidden="true">
        <label class="theme-switch" for="checkbox" title="Toggle dark mode">
          <input type="checkbox" id="checkbox" />
          <div class="slider"></div>
        </label>
      </div>
    `;

    const toggler = shadowRoot.querySelector('input[type="checkbox"]');
    const current = localStorage.getItem("theme") || null;

    if (
      matchMedia("prefers-color-scheme: dark").matches ||
      current === "dark"
    ) {
      toggler.checked = true;
      this.setDarkTheme();
    }
    toggler.addEventListener("change", this.switchTheme.bind(this), false);
  }

  switchTheme(e) {
    e.target.checked ? this.setDarkTheme() : this.setLightTheme();
  }

  setDarkTheme() {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }

  setLightTheme() {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

customElements.define("dark-mode-switcher", DarkModeSwitcher);
