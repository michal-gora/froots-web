const currentPage = window.location.pathname === "/"
  ? "/"
  : `${window.location.pathname.replace(/\/+$/, "")}/`;

function addFavicon() {
  const existingFavicon = document.querySelector('link[rel="icon"]');

  if (existingFavicon) {
    existingFavicon.remove();
  }

  const favicon = document.createElement("link");

  favicon.rel = "icon";
  favicon.href = "/favicon.svg";
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

function createNavigation(siteContent) {
  const navLinks = (siteContent.navigation || [])
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
        <a class="brand" href="/" aria-label="Froots home">
          <img
            class="brand__logo"
            src="/images/logo/froots-logo-black.svg"
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

function createSocialLinks(socialLinks) {
  return socialLinks
    .map(({ label, href, icon, placeholder }) => {
      const placeholderAttribute = placeholder
        ? 'data-social-placeholder="true"'
        : "";

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
          <i class="bi bi-${icon}" aria-hidden="true"></i>
        </a>
      `;
    })
    .join("");
}

function createFooter(siteContent) {
  const year = new Date().getFullYear();
  const email = siteContent.contactEmail || "";
  const socialLinks = Array.isArray(siteContent.socialLinks)
    ? siteContent.socialLinks
    : [];
  const legalLinks = Array.isArray(siteContent.legalLinks)
    ? siteContent.legalLinks
    : [];

  return `
    <footer class="site-footer">
      <div class="site-footer__inner container">
        <div class="footer__identity">
          <a class="footer__logo-link" href="/" aria-label="Froots home">
            <img
              class="footer__logo"
              src="/images/logo/froots-logo-white.svg"
              alt="Froots"
            >
          </a>

          <p class="brand__tagline">${siteContent.tagline || ""}</p>
        </div>

        <div class="footer__links">
          ${email ? `<a class="footer__email" href="mailto:${email}">${email}</a>` : ""}

          <div class="footer__social-links" aria-label="Froots social media">
            ${createSocialLinks(socialLinks)}
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">© ${year} Froots</p>

          <nav class="footer__legal-links" aria-label="Legal links">
            ${legalLinks.map(({ label, href }) => `<a href="${href}">${label}</a>`).join("")}
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

async function loadContentFile(path, fallback) {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Unable to load ${path}`, error);
    return fallback;
  }
}

async function initializePage() {
  addFavicon();

  const [siteContent, events] = await Promise.all([
    loadContentFile("/content/site.json", {}),
    loadContentFile("/content/events.json", [])
  ]);

  const headerTarget = document.querySelector("[data-site-header]");
  const footerTarget = document.querySelector("[data-site-footer]");

  if (headerTarget) headerTarget.innerHTML = createNavigation(siteContent);
  if (footerTarget) footerTarget.innerHTML = createFooter(siteContent);

  setupMobileNavigation();
  renderHomeNextEvent(Array.isArray(events) ? events : []);
  renderEvents(Array.isArray(events) ? events : []);
}

document.addEventListener("DOMContentLoaded", initializePage);

function formatHomeEventDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  if (!hasValue(dateString) || Number.isNaN(date.getTime())) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function getNextEvent(events) {
  const upcomingEvents = events
    .filter((event) => !isPastEvent(event))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return upcomingEvents[0] || null;
}

function createHomeEventMarkup(event) {
  const posterMarkup = hasValue(event.poster)
    ? `
      <a
        class="home-next-event__poster"
        href="${event.poster.trim()}"
        aria-label="Open full-size flyer for ${event.title || "Froots"}"
      >
        <img
          src="${event.poster.trim()}"
          alt="Poster for ${event.title || "Froots"} at ${event.venue || "venue to be announced"}"
        >
        <span class="flyer-link__hint">Open full-size flyer <span aria-hidden="true">↗</span></span>
      </a>
    `
    : `
      <div class="home-next-event__poster home-next-event__poster--placeholder" aria-hidden="true">
        <span>Froots</span>
      </div>
    `;

  const timeParts = [];

  if (event.doors) timeParts.push(`Doors <strong>${event.doors}</strong>`);
  if (event.showTime) timeParts.push(`Show <strong>${event.showTime}</strong>`);

  const timeMarkup = timeParts.length
    ? `<p class="home-next-event__time">${timeParts.join(" · ")}</p>`
    : "";

  const buttonMarkup = hasValue(event.url)
    ? `
      ${createEventLink(event, false, "button")}
      <a class="button button--outline" href="/dates/">All dates</a>
    `
    : `<a class="button" href="/dates/">See all dates</a>`;

  return `
    <article class="home-next-event">
      ${posterMarkup}

      <div class="home-next-event__content">
        <p class="eyebrow">Next up</p>
        <p class="home-next-event__date">${formatHomeEventDate(event.date)}</p>

        <h2>${event.title || "Froots"}</h2>

        <p class="home-next-event__venue">
          <strong>${event.venue || "Venue to be announced"}</strong><br>
          ${[event.city, event.country].filter(hasValue).join(", ")}
        </p>

        ${timeMarkup}

        ${
          event.description
            ? `<p class="home-next-event__description">${event.description}</p>`
            : ""
        }

        <div class="home-next-event__actions">
          ${buttonMarkup}
        </div>
      </div>
    </article>
  `;
}

function renderHomeNextEvent(events) {
  const target = document.querySelector("[data-home-next-event]");

  if (!target) return;

  const nextEvent = getNextEvent(events);

  if (!nextEvent) {
    (target.closest("[data-home-next-event-section]") || target).remove();
    return;
  }

  target.innerHTML = createHomeEventMarkup(nextEvent);
}

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function formatEventDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  if (!hasValue(dateString) || Number.isNaN(date.getTime())) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatMonth(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    month: "short"
  }).format(date);
}

function formatDay(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit"
  }).format(date);
}

function isPastEvent(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(`${event.date}T23:59:59`);
  return !Number.isNaN(eventDate.getTime()) && eventDate < today;
}

function createTicketStatusLabel(status) {
  const statusLabels = {
    "sold-out": "Sold out",
    cancelled: "Cancelled",
    private: "Private event"
  };

  if (!statusLabels[status]) return "";
  return `<span class="event-status event-status--${status}">${statusLabels[status]}</span>`;
}

function createTimeLine(event) {
  const parts = [];

  if (event.doors) parts.push(`Doors <strong>${event.doors}</strong>`);
  if (event.showTime) parts.push(`Show <strong>${event.showTime}</strong>`);

  return parts.length ? `<p class="event-card__time">${parts.join(" · ")}</p>` : "";
}

function createEventLink(event, pastEvent = false, className = "button button--small") {
  if (event.ticketStatus === "cancelled") {
    return `<span class="event-card__archive-label">This event has been cancelled</span>`;
  }

  if (event.ticketStatus === "sold-out") {
    return `<span class="event-card__archive-label">Tickets sold out</span>`;
  }

  if (!hasValue(event.url)) {
    return pastEvent
      ? ""
      : `<span class="event-card__archive-label">More details soon</span>`;
  }

  const external = /^https?:\/\//i.test(event.url.trim());
  const target = external ? ' target="_blank" rel="noopener noreferrer"' : "";

  return `
    <a class="${className}" href="${event.url.trim()}"${target}>
      ${hasValue(event.urlLabel) ? event.urlLabel.trim() : "More information"}
    </a>
  `;
}

function createEventCard(event, pastEvent = false) {
  const posterMarkup = hasValue(event.poster)
    ? `
      <a
        class="event-card__poster"
        href="${event.poster.trim()}"
        aria-label="Open full-size flyer for ${event.title || "Froots"}"
      >
        <img
          src="${event.poster.trim()}"
          alt="Poster for ${event.title || "Froots"} at ${event.venue || "venue to be announced"}"
          loading="lazy"
        >
        <span class="flyer-link__hint">Open full-size flyer <span aria-hidden="true">↗</span></span>
      </a>
    `
    : `
      <div class="event-card__poster event-card__poster--placeholder" aria-hidden="true">
        <img src="/images/logo/froots-logo-colour-horizontal-1376x768.jpg">
      </div>
    `;

  const pastClass = pastEvent ? "event-card--past" : "";
  const featuredClass = pastEvent ? "" : "event-card--featured";
  const eventLinkMarkup = createEventLink(event, pastEvent);

  return `
    <article class="event-card ${featuredClass} ${pastClass}">
      <div class="event-card__date-block" aria-label="${formatEventDate(event.date)}">
        <span class="event-card__day">${formatDay(event.date)}</span>
        <span class="event-card__month">${formatMonth(event.date)}</span>
      </div>

      ${posterMarkup}

      <div class="event-card__content">
        <div class="event-card__heading">
          <div>
            <p class="event-card__full-date">${formatEventDate(event.date)}</p>
            <h2>${event.title || "Froots"}</h2>
          </div>
          ${createTicketStatusLabel(event.ticketStatus)}
        </div>

        <p class="event-card__venue">
          <strong>${event.venue || "Venue to be announced"}</strong>
          ${[event.city, event.country].filter(hasValue).length ? `<span>${[event.city, event.country].filter(hasValue).join(", ")}</span>` : ""}
        </p>

        ${
          hasValue(event.address) && !/^replace with\b/i.test(event.address.trim())
            ? `<p class="event-card__address"><span class="event-card__address-label">Address</span><span class="event-card__address-value">${event.address.trim()}</span></p>`
            : ""
        }

        ${createTimeLine(event)}

        ${
          hasValue(event.description)
            ? `<p class="event-card__description">${event.description.trim()}</p>`
            : ""
        }

        ${
          event.showPrice !== false && hasValue(event.price)
            ? `<p class="event-card__price">${event.price.trim()}</p>`
            : ""
        }

        ${
          hasValue(event.entryNote)
            ? `<p class="event-card__note"><span class="event-card__note-icon" aria-hidden="true"><i class="bi bi-info-circle-fill"></i></span>${event.entryNote.trim()}</p>`
            : ""
        }

        ${eventLinkMarkup ? `<div class="event-card__action">${eventLinkMarkup}</div>` : ""}
      </div>
    </article>
  `;
}

function renderEvents(events) {
  const upcomingTarget = document.querySelector("[data-upcoming-events]");
  const archiveTarget = document.querySelector("[data-past-events]");
  const upcomingSection = document.querySelector("[data-upcoming-section]");

  if (!upcomingTarget || !archiveTarget) return;

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const upcomingEvents = sortedEvents
    .filter((event) => !isPastEvent(event))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = sortedEvents.filter((event) => isPastEvent(event));

  if (upcomingEvents.length) {
    upcomingTarget.innerHTML = upcomingEvents.map((event) => createEventCard(event)).join("");
  } else {
    upcomingTarget.closest(".section")?.classList.add("section--no-upcoming");
    upcomingSection?.remove();
  }

  archiveTarget.innerHTML = pastEvents.length
    ? pastEvents.map((event) => createEventCard(event, true)).join("")
    : `
      <div class="empty-events-message">
        <p>Our show archive will live here.</p>
      </div>
    `;
}
