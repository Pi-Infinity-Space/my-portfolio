async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(path + " not found");
  return res.json();
}

function articleCard(a) {
  return `
    <a href="article.html?post=${a.file}" class="card">
      <span class="card-meta">${a.date}</span>
      <h3 class="card-title">${a.title}</h3>
      <p class="card-desc">${a.summary}</p>
    </a>`;
}

function projectCard(p) {
  const tags = p.tech.map(t => `<span class="tag">${t}</span>`).join("");
  const live = p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live</a>` : "";
  const code = p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code</a>` : "";
  return `
    <div class="card">
      <span class="card-meta">Project</span>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-desc">${p.description}</p>
      <div class="tags">${tags}</div>
      <div class="card-links">${live}${code}</div>
    </div>`;
}

async function renderLatest() {
  const articleBox = document.getElementById("latest-articles");
  const projectBox = document.getElementById("latest-projects");

  try {
    if (articleBox) {
      const articles = await loadJSON("articles/articles.json");
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      articleBox.innerHTML = articles.slice(0, 3).map(articleCard).join("");
    }
    if (projectBox) {
      const projects = await loadJSON("projects.json");
      projectBox.innerHTML = projects.slice(0, 3).map(projectCard).join("");
    }
  } catch (err) {
    console.error(err);
  }
}

renderLatest();

async function renderAll() {
  const allArticles = document.getElementById("all-articles");
  const allProjects = document.getElementById("all-projects");

  try {
    if (allArticles) {
      const articles = await loadJSON("articles/articles.json");
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      allArticles.innerHTML = articles.length
        ? articles.map(articleCard).join("")
        : '<p class="empty">No articles yet.</p>';
    }
    if (allProjects) {
      const projects = await loadJSON("projects.json");
      allProjects.innerHTML = projects.length
        ? projects.map(projectCard).join("")
        : '<p class="empty">No projects yet.</p>';
    }
  } catch (err) {
    console.error(err);
  }
}

renderAll();
async function renderArticle() {
  const box = document.getElementById("article");
  if (!box) return;

  const notFound = '<a href="writing.html" class="back">&larr; All writing</a><p class="empty">Article not found.</p>';
  const slug = new URLSearchParams(window.location.search).get("post");
  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    box.innerHTML = notFound;
    return;
  }

  try {
    const [articles, res] = await Promise.all([
      loadJSON("articles/articles.json"),
      fetch(`articles/${slug}.md`)
    ]);
    if (!res.ok) throw new Error("missing");

    const meta = articles.find(a => a.file === slug);
    const markdown = await res.text();
    const title = meta ? meta.title : slug;

    document.title = title + " | your-name";
    box.innerHTML = `
      <a href="writing.html" class="back">&larr; All writing</a>
      ${meta ? `<span class="card-meta">${meta.date}</span>` : ""}
      <h1>${title}</h1>
      <div class="article-body">${marked.parse(markdown)}</div>`;
  } catch (err) {
    console.error(err);
    box.innerHTML = notFound;
  }
}

renderArticle();