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

          <div class="footer__legal-links">
            <a href="impressum.html">Impressum</a>
            <a href="datenschutz.html">Datenschutz</a>
          </div>
        </div>

        <p class="footer__copyright">© ${year} Froots</p>
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
  const headerTarget = document.querySelector("[data-site-header]");
  const footerTarget = document.querySelector("[data-site-footer]");

  if (headerTarget) headerTarget.innerHTML = createNavigation();
  if (footerTarget) footerTarget.innerHTML = createFooter();

  setupMobileNavigation();
});