function initSmoothNav() {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>("nav.site-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const href = link.getAttribute("href") ?? "";
      const targetId = href.split("#")[1];
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: "smooth" });

      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "#" +
        targetId;
      window.history.pushState({ path: newUrl }, "", newUrl);
    });
  });

  const handleHashChange = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const targetElement = document.getElementById(hash.substring(1));
    if (!targetElement) return;

    targetElement.scrollIntoView({ behavior: "smooth" });
    const activeLink = document.querySelector<HTMLAnchorElement>(
      `nav.site-nav a[href="${hash}"]`,
    );
    if (activeLink) {
      navLinks.forEach((l) => l.classList.remove("active"));
      activeLink.classList.add("active");
    }
  };

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
}

function initAriaLabels() {
  document.querySelectorAll<HTMLElement>(".link-card").forEach((card) => {
    const link = card.querySelector<HTMLAnchorElement>("a");
    const heading = card.querySelector("h3");
    if (link && heading && !link.getAttribute("aria-label")) {
      link.setAttribute("aria-label", heading.textContent ?? "");
    }
  });
}

function bootstrap() {
  initSmoothNav();
  initAriaLabels();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}