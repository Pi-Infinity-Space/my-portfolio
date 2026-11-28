async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function sanitizeArticleHTML(html) {
  const allowedTags = new Set([
    "A", "BLOCKQUOTE", "BR", "CODE", "DEL", "EM", "H1", "H2", "H3",
    "H4", "H5", "H6", "HR", "IMG", "LI", "OL", "P", "PRE", "STRONG",
    "TABLE", "TBODY", "TD", "TH", "THEAD", "TR", "UL"
  ]);
  const parsed = new DOMParser().parseFromString(html, "text/html");

  function clean(node) {
    for (const child of [...node.children]) {
      if (!allowedTags.has(child.tagName)) {
        child.remove();
        continue;
      }

      for (const attribute of [...child.attributes]) {
        const name = attribute.name.toLowerCase();
        const allowed = name === "title" || name === "alt" ||
          (child.tagName === "A" && name === "href") ||
          (child.tagName === "IMG" && name === "src");
        if (!allowed) child.removeAttribute(attribute.name);
      }

      if (child.tagName === "A" && child.hasAttribute("href")) {
        const safeHref = safeExternalUrl(child.getAttribute("href"));
        if (safeHref) child.setAttribute("href", safeHref);
        else child.removeAttribute("href");
      }
      if (child.tagName === "IMG" && child.hasAttribute("src")) {
        const safeSrc = safeExternalUrl(child.getAttribute("src"));
        if (safeSrc) child.setAttribute("src", safeSrc);
        else child.remove();
      }
      if (child.isConnected) clean(child);
    }
  }

  clean(parsed.body);
  return parsed.body.innerHTML;
}

function articleCard(article) {
  return `
    <a href="article.html?post=${encodeURIComponent(article.file)}" class="card">
      <span class="card-meta">${escapeHTML(article.date)}</span>
      <h3 class="card-title">${escapeHTML(article.title)}</h3>
      <p class="card-desc">${escapeHTML(article.summary)}</p>
    </a>`;
}

function projectCard(project) {
  const tags = project.tech.map(tech => `<span class="tag">${escapeHTML(tech)}</span>`).join("");
  const liveUrl = project.live ? safeExternalUrl(project.live) : "";
  const codeUrl = project.code ? safeExternalUrl(project.code) : "";
  const live = liveUrl
    ? `<a href="${escapeHTML(liveUrl)}" target="_blank" rel="noopener noreferrer">Live</a>`
    : "";
  const code = codeUrl
    ? `<a href="${escapeHTML(codeUrl)}" target="_blank" rel="noopener noreferrer">Code</a>`
    : "";

  return `
    <div class="card">
      <span class="card-meta">Project</span>
      <h3 class="card-title">${escapeHTML(project.title)}</h3>
      <p class="card-desc">${escapeHTML(project.description)}</p>
      <div class="tags">${tags}</div>
      <div class="card-links">${live}${code}</div>
    </div>`;
}

async function renderList(id, path, label, renderItem, emptyMessage, limit) {
  const box = document.getElementById(id);
  if (!box) return;

  try {
    const items = await loadJSON(path);
    if (!Array.isArray(items)) throw new Error(`${path} must contain a JSON array`);
    if (label === "articles") {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;
    box.innerHTML = visibleItems.length
      ? visibleItems.map(renderItem).join("")
      : `<p class="empty">${emptyMessage}</p>`;
  } catch (error) {
    console.error(`Unable to load ${label}.`, error);
    box.innerHTML = `<p class="empty">Unable to load ${label} right now. Please try again later.</p>`;
  }
}

renderList("latest-articles", "articles/articles.json", "articles", articleCard, "No articles yet.", 3);
renderList("latest-projects", "projects.json", "projects", projectCard, "No projects yet.", 3);
renderList("all-articles", "articles/articles.json", "articles", articleCard, "No articles yet.");
renderList("all-projects", "projects.json", "projects", projectCard, "No projects yet.");

async function renderArticle() {
  const box = document.getElementById("article");
  if (!box) return;

  const showNotFound = () => {
    box.innerHTML = '<a href="writing.html" class="back">&larr; All writing</a><p class="empty">Article not found.</p>';
  };
  const slug = new URLSearchParams(window.location.search).get("post");
  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    showNotFound();
    return;
  }

  try {
    const articles = await loadJSON("articles/articles.json");
    if (!Array.isArray(articles)) throw new Error("Article metadata must contain a JSON array");
    const article = articles.find(item => item.file === slug);
    if (!article) {
      showNotFound();
      return;
    }

    const response = await fetch(`articles/${encodeURIComponent(slug)}.md`);
    if (response.status === 404) {
      showNotFound();
      return;
    }
    if (!response.ok) throw new Error(`Article returned ${response.status}`);
    if (!window.marked) throw new Error("Markdown renderer did not load");

    const markdown = await response.text();
    document.title = `${article.title} | Odinakachukwu Okafor`;
    box.innerHTML = `
      <a href="writing.html" class="back">&larr; All writing</a>
      <span class="card-meta">${article.date}</span>
      <h1>${article.title}</h1>
      <div class="article-body">${sanitizeArticleHTML(window.marked.parse(markdown))}</div>`;
  } catch (error) {
    console.error("Unable to load article.", error);
    box.innerHTML = '<a href="writing.html" class="back">&larr; All writing</a><p class="empty">Unable to load this article right now. Please try again later.</p>';
  }
}

renderArticle();
