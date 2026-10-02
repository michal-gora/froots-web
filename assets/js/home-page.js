function formatHomeEventDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function isHomePastEvent(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(`${event.date}T23:59:59`);

  return eventDate < today || event.status === "past";
}

function getNextEvent() {
  const upcomingEvents = events
    .filter((event) => !isHomePastEvent(event))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const featuredEvent = upcomingEvents.find((event) => event.featured);

  return featuredEvent || upcomingEvents[0] || null;
}

function createHomeEventMarkup(event) {
  if (!event) {
    return `
      <div class="home-next-event home-next-event--empty">
        <div class="home-next-event__content">
          <p class="eyebrow">Next up</p>
          <h2>Fresh dates are growing.</h2>
          <p>
            We are working on the next chance to share a groove with you.
            Check back soon, or follow our channels for updates.
          </p>
          <a class="button" href="dates.html">See all dates</a>
        </div>
      </div>
    `;
  }

  const posterMarkup = event.poster
    ? `
      <a
        class="home-next-event__poster"
        href="dates.html"
        aria-label="See details for ${event.title}"
      >
        <img
          src="${event.poster}"
          alt="Poster for ${event.title} at ${event.venue}, ${event.city}"
        >
      </a>
    `
    : `
      <div class="home-next-event__poster home-next-event__poster--placeholder" aria-hidden="true">
        <span>Froots</span>
      </div>
    `;

  const timeParts = [];

  if (event.doors) timeParts.push(`Doors ${event.doors}`);
  if (event.showTime) timeParts.push(`Show ${event.showTime}`);

  const timeMarkup = timeParts.length
    ? `<p class="home-next-event__time">${timeParts.join(" · ")}</p>`
    : "";

  const buttonMarkup = event.ticketUrl
    ? `
      <a
        class="button"
        href="${event.ticketUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${event.ticketLabel || "Get tickets"}
      </a>
      <a class="button button--outline" href="dates.html">All dates</a>
    `
    : `<a class="button" href="dates.html">See all dates</a>`;

  return `
    <article class="home-next-event">
      ${posterMarkup}

      <div class="home-next-event__content">
        <p class="eyebrow">Next up</p>
        <p class="home-next-event__date">${formatHomeEventDate(event.date)}</p>

        <h2>${event.title}</h2>

        <p class="home-next-event__venue">
          <strong>${event.venue}</strong><br>
          ${event.city}${event.country ? `, ${event.country}` : ""}
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

function renderHomeNextEvent() {
  const target = document.querySelector("[data-home-next-event]");

  if (!target || typeof events === "undefined") return;

  target.innerHTML = createHomeEventMarkup(getNextEvent());
}

document.addEventListener("DOMContentLoaded", renderHomeNextEvent);