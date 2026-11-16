// 用于标记 window 级 hashchange 监听器是否已绑定，避免启用
// View Transitions 后重复绑定（模块被缓存，变量跨页面切换保留）
let hashHandlerBound = false;

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function initSmoothNav() {
  // 仅对未绑定的导航链接添加监听，保证 bootstrap 幂等，
  // 在 View Transitions 切换页面后只绑定新插入的元素
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    "nav.site-nav a:not([data-nav-bound])",
  );

  navLinks.forEach((link) => {
    link.setAttribute("data-nav-bound", "");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll("nav.site-nav a")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const href = link.getAttribute("href") ?? "";
      const targetId = href.split("#")[1];
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: getScrollBehavior() });

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

  // hashchange 是 window 级事件，整个会话只需绑定一次
  if (!hashHandlerBound) {
    hashHandlerBound = true;
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: getScrollBehavior() });
      }

      const activeLink = document.querySelector<HTMLAnchorElement>(
        `nav.site-nav a[href="${hash}"]`,
      );
      if (activeLink) {
        document
          .querySelectorAll("nav.site-nav a")
          .forEach((l) => l.classList.remove("active"));
        activeLink.classList.add("active");
      }
    });
  }

  // 每次页面加载同步一次当前 hash 对应的高亮状态
  if (window.location.hash) {
    const activeLink = document.querySelector<HTMLAnchorElement>(
      `nav.site-nav a[href="${window.location.hash}"]`,
    );
    if (activeLink) {
      document
        .querySelectorAll("nav.site-nav a")
        .forEach((l) => l.classList.remove("active"));
      activeLink.classList.add("active");
    }
  }
}

function bootstrap() {
  initSmoothNav();
}

// 兼容 Astro View Transitions：启用后每次页面切换都会触发
document.addEventListener("astro:page-load", bootstrap);

// 未启用 View Transitions 时 astro:page-load 不会触发，用 DOMContentLoaded 兜底
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

export {};
