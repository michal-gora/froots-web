function formatEventDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

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
  return eventDate < today || event.status === "past";
}

function createStatusLabel(status) {
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

  if (event.doors) parts.push(`Doors ${event.doors}`);
  if (event.showTime) parts.push(`Show ${event.showTime}`);

  return parts.length ? `<p class="event-card__time">${parts.join(" · ")}</p>` : "";
}

function createTicketArea(event, pastEvent) {
  if (pastEvent) {
    return `<span class="event-card__archive-label">Past show</span>`;
  }

  if (event.status === "cancelled") {
    return `<span class="event-card__archive-label">This event has been cancelled</span>`;
  }

  if (event.status === "sold-out") {
    return `<span class="event-card__archive-label">Tickets sold out</span>`;
  }

  if (event.ticketUrl) {
    const label = event.ticketLabel || "Get tickets";

    return `
      <a
        class="button button--small"
        href="${event.ticketUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${label}
      </a>
    `;
  }

  return `<span class="event-card__archive-label">More details soon</span>`;
}

function createEventCard(event, pastEvent = false) {
  const posterMarkup = event.poster
    ? `
      <a
        class="event-card__poster"
        href="${event.poster}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open poster for ${event.title}"
      >
        <img
          src="${event.poster}"
          alt="Poster for ${event.title} at ${event.venue}, ${event.city}"
          loading="lazy"
        >
      </a>
    `
    : `
      <div class="event-card__poster event-card__poster--placeholder" aria-hidden="true">
        <span>Froots</span>
      </div>
    `;

  const featuredClass = event.featured ? "event-card--featured" : "";
  const pastClass = pastEvent ? "event-card--past" : "";

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
            <h2>${event.title}</h2>
          </div>
          ${createStatusLabel(event.status)}
        </div>

        <p class="event-card__venue">
          <strong>${event.venue}</strong>
          <span>${event.city}${event.country ? `, ${event.country}` : ""}</span>
        </p>

        ${createTimeLine(event)}

        ${
          event.description
            ? `<p class="event-card__description">${event.description}</p>`
            : ""
        }

        ${
          event.price
            ? `<p class="event-card__price">${event.price}</p>`
            : ""
        }

        ${
          event.entryNote
            ? `<p class="event-card__note">${event.entryNote}</p>`
            : ""
        }
      </div>

      <div class="event-card__action">
        ${createTicketArea(event, pastEvent)}
      </div>
    </article>
  `;
}

function renderEvents() {
  const upcomingTarget = document.querySelector("[data-upcoming-events]");
  const archiveTarget = document.querySelector("[data-past-events]");

  if (!upcomingTarget || !archiveTarget) return;

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const upcomingEvents = sortedEvents
    .filter((event) => !isPastEvent(event))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = sortedEvents.filter((event) => isPastEvent(event));

  upcomingTarget.innerHTML = upcomingEvents.length
    ? upcomingEvents.map((event) => createEventCard(event)).join("")
    : `
      <div class="empty-events-message">
        <p>New Froots dates are growing soon.</p>
        <p>Follow us or write to <a href="mailto:info@frootsmusic.eu">info@frootsmusic.eu</a> for booking and news.</p>
      </div>
    `;

  archiveTarget.innerHTML = pastEvents.length
    ? pastEvents.map((event) => createEventCard(event, true)).join("")
    : `
      <div class="empty-events-message">
        <p>Our show archive will live here.</p>
      </div>
    `;
}

document.addEventListener("DOMContentLoaded", renderEvents);