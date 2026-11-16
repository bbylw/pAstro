// 用于标记 window 级 hashchange 监听器是否已绑定，避免启用
// View Transitions 后重复绑定（模块被缓存，变量跨页面切换保留）
let hashHandlerBound = false;

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function setActiveNavLink(activeLink: HTMLAnchorElement) {
  document.querySelectorAll<HTMLAnchorElement>("nav.site-nav a").forEach((l) => {
    const isCurrent = l === activeLink;
    l.classList.toggle("active", isCurrent);
    if (isCurrent) {
      l.setAttribute("aria-current", "location");
    } else {
      l.removeAttribute("aria-current");
    }
  });
}

function findNavLinkByHash(hash: string): HTMLAnchorElement | undefined {
  if (!hash) return undefined;
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>("nav.site-nav a"),
  ).find((link) => link.getAttribute("href") === hash);
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
      setActiveNavLink(link);

      const href = link.getAttribute("href") ?? "";
      const targetId = href.split("#")[1];
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: getScrollBehavior() });
      window.history.pushState(null, "", `#${targetId}`);
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

      const activeLink = findNavLinkByHash(hash);
      if (activeLink) setActiveNavLink(activeLink);
    });
  }

  // 每次页面加载同步一次当前 hash 对应的高亮状态
  const initialLink = findNavLinkByHash(window.location.hash);
  if (initialLink) setActiveNavLink(initialLink);
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
