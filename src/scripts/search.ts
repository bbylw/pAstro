function initSearch() {
  const input = document.querySelector<HTMLInputElement>("#site-search");
  if (!input || input.dataset.searchBound === "true") return;
  input.dataset.searchBound = "true";

  const status = document.querySelector<HTMLElement>("#search-status");
  let announceTimer: number | undefined;

  function applyFilter(announce: boolean) {
    const query = input!.value.trim().toLowerCase();
    const sections = document.querySelectorAll<HTMLElement>("main section");
    let matchCount = 0;

    sections.forEach((section) => {
      const cards = section.querySelectorAll<HTMLElement>(".link-card");
      let sectionHasMatch = false;

      cards.forEach((card) => {
        const text = (card.textContent ?? "").toLowerCase();
        const match = query === "" || text.includes(query);
        card.style.display = match ? "" : "none";
        if (match) {
          matchCount += 1;
          sectionHasMatch = true;
        }
      });

      // 隐藏没有任何匹配卡片的分类区块
      section.style.display = query === "" || sectionHasMatch ? "" : "none";
    });

    if (announce && status) {
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(() => {
        status.textContent =
          query === ""
            ? ""
            : matchCount > 0
              ? `找到 ${matchCount} 个匹配站点`
              : "未找到匹配站点";
      }, 300);
    }
  }

  input.addEventListener("input", () => applyFilter(true));

  // 浏览器历史回退恢复输入框内容时同步过滤结果
  if (input.value.trim() !== "") {
    applyFilter(false);
  }
}

// 兼容 Astro View Transitions：启用后每次页面切换都会触发
document.addEventListener("astro:page-load", initSearch);

// 未启用 View Transitions 时用 DOMContentLoaded 兜底
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  initSearch();
}

export {};
