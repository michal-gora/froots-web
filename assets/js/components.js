const currentPage = window.location.pathname.split("/").pop() || "index.html";

const navigationItems = [
  { label: "Home", href: "index.html" },
  { label: "Dates", href: "dates.html" },
  { label: "Music", href: "music.html" },
  { label: "About", href: "about.html" }
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    placeholder: true
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/",
    placeholder: true
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    placeholder: true
  }
];

function addFavicon() {
  const existingFavicon = document.querySelector('link[rel="icon"]');

  if (existingFavicon) {
    existingFavicon.remove();
  }

  const favicon = document.createElement("link");

  favicon.rel = "icon";
  favicon.href = "assets/icons/leftlemon.svg"
  document.head.appendChild(favicon);

  const existingThemeColor = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (existingThemeColor) {
    existingThemeColor.remove();
  }

  const themeColor = document.createElement("meta");

  themeColor.name = "theme-color";
  themeColor.content = "#241811";

  document.head.appendChild(themeColor);
}

function createNavigation() {
  const navLinks = navigationItems
    .map(({ label, href }) => {
      const isCurrent = href === currentPage;
      const currentAttribute = isCurrent ? 'aria-current="page"' : "";

      return `
        <li>
          <a href="${href}" ${currentAttribute}>${label}</a>
        </li>
      `;
    })
    .join("");

  return `
    <header class="site-header">
      <div class="site-header__inner container">
        <a class="brand" href="index.html" aria-label="Froots home">
          <img
            class="brand__logo"
            src="assets/icons/froots-logo-black.svg"
            alt="Froots"
          >
        </a>

        <button
          class="nav-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded="false"
          aria-controls="primary-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="primary-navigation" class="primary-nav" aria-label="Primary navigation">
          <ul>
            ${navLinks}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

function createSocialLinks() {
  const iconNames = {
    Instagram: "instagram",
    TikTok: "tiktok",
    YouTube: "youtube"
  };

  return socialLinks
    .map(({ label, href, placeholder }) => {
      const placeholderAttribute = placeholder
        ? 'data-social-placeholder="true"'
        : "";

      const iconName = iconNames[label];

      return `
        <a
          class="social-icon-link"
          href="${href}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Froots on ${label}"
          title="${label}"
          ${placeholderAttribute}
        >
          <i class="bi bi-${iconName}" aria-hidden="true"></i>
        </a>
      `;
    })
    .join("");
}

function createFooter() {
  const year = new Date().getFullYear();

  return `
    <footer class="site-footer">
      <div class="site-footer__inner container">
        <div class="footer__identity">
          <a class="footer__logo-link" href="index.html" aria-label="Froots home">
            <img
              class="footer__logo"
              src="assets/icons/froots-logo-white.svg"
              alt="Froots"
            >
          </a>

          <p class="brand__tagline">Reggae &amp; funk from Munich.</p>
        </div>

        <div class="footer__links">
          <a class="footer__email" href="mailto:info@frootsmusic.eu">
            info@frootsmusic.eu
          </a>

          <div class="footer__social-links" aria-label="Froots social media">
            ${createSocialLinks()}
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">© ${year} Froots</p>

          <nav class="footer__legal-links" aria-label="Legal links">
            <a href="impressum.html">Impressum</a>
            <a href="datenschutz.html">Datenschutz</a>
          </nav>
        </div>
      </div>
    </footer>
  `;
}

function setupMobileNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".primary-nav");

  if (!toggle || !navigation) return;

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("primary-nav--open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addFavicon();

  const headerTarget = document.querySelector("[data-site-header]");
  const footerTarget = document.querySelector("[data-site-footer]");

  if (headerTarget) headerTarget.innerHTML = createNavigation();
  if (footerTarget) footerTarget.innerHTML = createFooter();

  setupMobileNavigation();
});